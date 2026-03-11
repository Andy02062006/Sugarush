import { NextResponse } from 'next/server';
import { db } from '../db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const deleted = db.deleteLog(resolvedParams.id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete glucose log' }, { status: 500 });
  }
}
