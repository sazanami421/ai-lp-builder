const VERCEL_API = 'https://api.vercel.com';
const PROJECT_ID = process.env.VERCEL_PROJECT_ID!;
const TOKEN = process.env.VERCEL_API_TOKEN!;

function headers() {
  return {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  };
}

/** Vercel プロジェクトにドメインを追加する */
export async function addDomainToVercel(domain: string): Promise<void> {
  const res = await fetch(`${VERCEL_API}/v10/projects/${PROJECT_ID}/domains`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ name: domain }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message ?? `Vercel API error: ${res.status}`);
  }
}

/** Vercel プロジェクトからドメインを削除する */
export async function removeDomainFromVercel(domain: string): Promise<void> {
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${PROJECT_ID}/domains/${domain}`,
    { method: 'DELETE', headers: headers() }
  );

  // 404（すでに存在しない）は無視
  if (!res.ok && res.status !== 404) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error?.message ?? `Vercel API error: ${res.status}`);
  }
}

export type DomainVerifyResult =
  | { verified: true }
  | { verified: false; reason: string };

/** ドメインのDNS検証状態を取得する */
export async function verifyDomain(domain: string): Promise<DomainVerifyResult> {
  const res = await fetch(
    `${VERCEL_API}/v9/projects/${PROJECT_ID}/domains/${domain}`,
    { headers: headers() }
  );

  if (!res.ok) {
    return { verified: false, reason: 'ドメインがVercelに登録されていません' };
  }

  const data = await res.json();

  if (data.verified) {
    return { verified: true };
  }

  // 未検証の場合、必要なDNSレコードを返す
  const config = data.verification?.[0];
  if (config?.type === 'CNAME') {
    return {
      verified: false,
      reason: `DNS未設定: CNAME ${config.domain} → ${config.value}`,
    };
  }

  return { verified: false, reason: 'DNS設定を確認してください' };
}
