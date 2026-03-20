import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ pageId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { pageId } = await params;
    // TODO: ページ取得
    return NextResponse.json({ page: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { pageId } = await params;
    const body = await req.json();
    // TODO: ページ更新
    return NextResponse.json({ page: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { pageId } = await params;
    // TODO: ページ削除
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
