import { NextResponse } from 'next/server';
import { db } from '../db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
       return NextResponse.json({ error: 'ID parameter is missing' }, { status: 400 });
    }

    const deleted = db.deleteLog(id);
    
    if (deleted) {
      return NextResponse.json({ success: true, message: 'Meal log deleted' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Meal log not found' }, { status: 404 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete meal log' }, { status: 500 });
  }
}
