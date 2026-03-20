import { NextRequest, NextResponse } from 'next/server';

type Params = { params: Promise<{ sectionId: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { sectionId } = await params;
    // TODO: セクション取得
    return NextResponse.json({ section: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { sectionId } = await params;
    const body = await req.json();
    // TODO: セクション更新
    return NextResponse.json({ section: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { sectionId } = await params;
    // TODO: セクション削除
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
