import { NextResponse } from 'next/server';
import { db } from './db';

export async function GET() {
  try {
    const logs = db.getLogs();
    return NextResponse.json(logs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch glucose logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In a real app we would strictly validate `body` here
    if (!body || typeof body.value !== 'number') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const newLog = db.addLog(body);
    return NextResponse.json(newLog, { status: 201 });
    
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save glucose log' }, { status: 500 });
  }
}
