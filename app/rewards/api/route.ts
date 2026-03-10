import { NextResponse } from 'next/server';
import { db } from './db';

// Safely fetch the user's current gamification progress (XP, streaks, unlocked rewards)
export async function GET() {
  try {
    const state = db.getState();
    return NextResponse.json(state);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch gamification state' }, { status: 500 });
  }
}
