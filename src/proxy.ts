import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 自分自身のドメイン（カスタムドメインと区別する）
const OWN_DOMAIN_PATTERNS = ['localhost', '.vercel.app'];

export async function proxy(req: NextRequest) {
  const host = req.headers.get('host') ?? '';
  // ポート番号を除去
  const domain = host.split(':')[0];

  // 自ドメインは何もしない
  if (OWN_DOMAIN_PATTERNS.some((p) => domain.includes(p))) {
    return NextResponse.next();
  }

  // カスタムドメインの可能性がある場合のみ DB を参照
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // pages テーブルから customDomain が一致する公開ページを検索
    const { data: page } = await supabase
      .from('pages')
      .select('projectId, domainVerified')
      .eq('customDomain', domain)
      .eq('isPublished', true)
      .maybeSingle();

    if (!page || !page.domainVerified) {
      return NextResponse.next();
    }

    // projects テーブルから slug を取得
    const { data: project } = await supabase
      .from('projects')
      .select('slug')
      .eq('id', page.projectId)
      .maybeSingle();

    if (!project?.slug) {
      return NextResponse.next();
    }

    // /p/[slug] にリライト（URLはカスタムドメインのまま表示される）
    const url = req.nextUrl.clone();
    url.pathname = `/p/${project.slug}`;
    return NextResponse.rewrite(url);
  } catch {
    // DB エラーは無視して通常のルーティングに戻す
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // API・静的ファイル・Next.js 内部パスを除外
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
