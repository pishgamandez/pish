// Client-Side Direct GitHub REST API Integration
// Works seamlessly on static GitHub Pages (pishgamandez.github.io/pishgaman/) as well as local dev servers

export interface ClientGitHubConfig {
  token: string;
  repo: string;
  branch: string;
  autoPush: boolean;
}

const STORAGE_KEYS = {
  TOKEN: 'pishgaman_gh_token',
  REPO: 'pishgaman_gh_repo',
  BRANCH: 'pishgaman_gh_branch',
  AUTOPUSH: 'pishgaman_gh_autopush',
};

export function getClientGitHubConfig(): ClientGitHubConfig {
  try {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
    const repo = localStorage.getItem(STORAGE_KEYS.REPO) || 'pishgamandez/pishgaman';
    const branch = localStorage.getItem(STORAGE_KEYS.BRANCH) || 'main';
    const autoPushVal = localStorage.getItem(STORAGE_KEYS.AUTOPUSH);
    const autoPush = autoPushVal !== null ? autoPushVal === 'true' : true;
    return { token, repo, branch, autoPush };
  } catch {
    return {
      token: '',
      repo: 'pishgamandez/pishgaman',
      branch: 'main',
      autoPush: true,
    };
  }
}

export function saveClientGitHubConfig(config: Partial<ClientGitHubConfig>): ClientGitHubConfig {
  const current = getClientGitHubConfig();
  const updated: ClientGitHubConfig = {
    token: config.token !== undefined ? config.token : current.token,
    repo: config.repo || current.repo,
    branch: config.branch || current.branch,
    autoPush: config.autoPush !== undefined ? config.autoPush : current.autoPush,
  };

  try {
    if (updated.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, updated.token.trim());
    } else if (config.token === '') {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
    localStorage.setItem(STORAGE_KEYS.REPO, updated.repo.trim());
    localStorage.setItem(STORAGE_KEYS.BRANCH, updated.branch.trim());
    localStorage.setItem(STORAGE_KEYS.AUTOPUSH, String(updated.autoPush));
  } catch (err) {
    console.warn('Failed to save GitHub config to localStorage:', err);
  }

  // Also silently attempt to sync with backend server if available
  try {
    fetch('/api/github/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  } catch {}

  return updated;
}

// Convert UTF-8 text (including Persian) to base64
export function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Test GitHub credentials directly with GitHub REST API
export async function testGitHubConnection(token: string, repo: string): Promise<{ ok: boolean; message: string; data?: any }> {
  if (!token || !token.trim()) {
    return { ok: false, message: 'لطفاً ابتدا کد توکن گیت‌هاب را وارد کنید.' };
  }
  const cleanToken = token.trim();
  const cleanRepo = (repo || 'pishgamandez/pishgaman').trim();

  try {
    const res = await fetch(`https://api.github.com/repos/${cleanRepo}`, {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (res.status === 200) {
      const data = await res.json();
      return {
        ok: true,
        message: `اتصال با موفقیت برقرار شد! مخزن: ${data.full_name} (شاخه پیش‌فرض: ${data.default_branch})`,
        data,
      };
    } else if (res.status === 401) {
      return { ok: false, message: 'خطای ۴۰۱: توکن نامعتبر است یا منقضی شده است. لطفاً توکن جدید با تیک repo ایجاد فرمایید.' };
    } else if (res.status === 404) {
      return { ok: false, message: `خطای ۴۰۴: مخزن ${cleanRepo} یافت نشد یا توکن دسترسی به آن ندارد. دقت کنید تیک repo فعال باشد.` };
    } else if (res.status === 403) {
      return { ok: false, message: 'خطای ۴۰۳: دسترسی توکن محدود است یا سقف مجاز درخواست‌ها پر شده است.' };
    } else {
      const err = await res.json().catch(() => ({}));
      return { ok: false, message: `خطا در اتصال (${res.status}): ${err.message || res.statusText}` };
    }
  } catch (err: any) {
    return { ok: false, message: `خطا در ارتباط اینترنتی با سرورهای گیت‌هاب: ${err.message || 'خطای شبکه'}` };
  }
}

// Fetch latest commit on repo
export async function getLatestGitHubCommit(token?: string, repo?: string): Promise<string | null> {
  const current = getClientGitHubConfig();
  const effectiveToken = (token || current.token || '').trim();
  const effectiveRepo = (repo || current.repo || 'pishgamandez/pishgaman').trim();

  try {
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (effectiveToken) {
      headers['Authorization'] = `Bearer ${effectiveToken}`;
    }

    const res = await fetch(`https://api.github.com/repos/${effectiveRepo}/commits?per_page=1&t=${Date.now()}`, { headers });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const c = data[0];
        const shortSha = c.sha.slice(0, 7);
        const msg = c.commit?.message || '';
        const firstLine = msg.split('\n')[0];
        const date = new Date(c.commit?.author?.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
        return `${shortSha} - ${firstLine} (ساعت ${date})`;
      }
    }
  } catch {}
  return null;
}

// Commit or update a file on GitHub repository
export async function commitOrUpdateFileToGitHub(
  filePath: string,
  contentBase64: string,
  commitMessage: string,
  overrideConfig?: { token?: string; repo?: string; branch?: string }
): Promise<{ ok: boolean; message: string; sha?: string }> {
  const current = getClientGitHubConfig();
  const token = (overrideConfig?.token || current.token || '').trim();
  const repo = (overrideConfig?.repo || current.repo || 'pishgamandez/pishgaman').trim();
  const branch = (overrideConfig?.branch || current.branch || 'main').trim();

  if (!token) {
    return { ok: false, message: 'توکن دسترسی گیت‌هاب تنظیم نشده است.' };
  }

  try {
    // 1. Fetch current file SHA if it exists
    let sha: string | undefined = undefined;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}&t=${Date.now()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
          },
        }
      );
      if (getRes.ok) {
        const fileData = await getRes.json();
        if (fileData.sha) {
          sha = fileData.sha;
        }
      }
    } catch {
      // file does not exist yet
    }

    // 2. Put file to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        branch: branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (putRes.ok || putRes.status === 201) {
      const result = await putRes.json();
      return {
        ok: true,
        message: `فایل ${filePath} با موفقیت در گیت‌هاب ثبت شد.`,
        sha: result?.content?.sha,
      };
    } else {
      const err = await putRes.json().catch(() => ({}));
      return {
        ok: false,
        message: `خطا در ذخیره فایل در گیت‌هاب (${putRes.status}): ${err.message || putRes.statusText}`,
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      message: `خطا در ارتباط با گیت‌هاب: ${err.message || 'خطای شبکه'}`,
    };
  }
}

// Sync products JSON & TypeScript source files directly to GitHub
export async function syncProductsDirectToGitHub(
  products: any[],
  customMessage?: string
): Promise<{ ok: boolean; message: string }> {
  const config = getClientGitHubConfig();
  if (!config.token) {
    return { ok: false, message: 'توکن گیت‌هاب تنظیم نشده است.' };
  }

  const message = customMessage || 'admin: update products data and catalogue';

  try {
    // 1. Commit data/products.json
    const jsonString = JSON.stringify(products, null, 2);
    const jsonBase64 = utf8ToBase64(jsonString);
    const jsonRes = await commitOrUpdateFileToGitHub('data/products.json', jsonBase64, message, config);
    if (!jsonRes.ok) {
      return jsonRes;
    }

    // 2. Commit src/data/products.ts so GitHub Actions build produces updated site
    const tsContent = `import { Product } from '../types';\n\nexport const initialProducts: Product[] = ${jsonString};\n`;
    const tsBase64 = utf8ToBase64(tsContent);
    const tsRes = await commitOrUpdateFileToGitHub('src/data/products.ts', tsBase64, message, config);
    if (!tsRes.ok) {
      return tsRes;
    }

    return {
      ok: true,
      message: 'کدهای محصولات با موفقیت در گیت‌هاب ثبت شد و انتشار خودکار آغاز گردید.',
    };
  } catch (err: any) {
    return {
      ok: false,
      message: 'خطا در ارسال کدهای محصولات به گیت‌هاب: ' + (err.message || ''),
    };
  }
}

// Upload product image directly to predefined slot on GitHub
export async function uploadImageDirectToGitHub(
  productId: string,
  base64Data: string,
  ext: string = 'jpg'
): Promise<{ ok: boolean; url: string; message: string }> {
  const config = getClientGitHubConfig();
  const safeId = productId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanExt = ext.replace(/^\./, '').toLowerCase() || 'jpg';
  const filePath = `public/assets/images/products/${safeId}.${cleanExt}`;
  const relativeUrl = `./assets/images/products/${safeId}.${cleanExt}`;

  // Clean data URL prefix if present
  let cleanBase64 = base64Data;
  if (cleanBase64.includes('base64,')) {
    cleanBase64 = cleanBase64.split('base64,')[1];
  }

  if (!config.token) {
    return {
      ok: false,
      url: relativeUrl,
      message: 'تصویر ذخیره شد، اما برای ارسال به گیت‌هاب توکن گیت‌هاب را وارد نمایید.',
    };
  }

  const res = await commitOrUpdateFileToGitHub(
    filePath,
    cleanBase64,
    `admin: upload packaging photo for product ${safeId}`,
    config
  );

  return {
    ok: res.ok,
    url: relativeUrl,
    message: res.message,
  };
}
