import { NextResponse } from 'next/server';
import { db } from '../db';
import { MOCK_REWARDS } from '../../../../lib/mocks'; // We import to securely verify costs

// Processing a redemption correctly via the server to prevent client-side cheating
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rewardId } = body;

    if (!rewardId) {
      return NextResponse.json({ error: 'Reward ID missing' }, { status: 400 });
    }

    // 1. Double-check the actual reward cost securely on the backend
    const targetReward = MOCK_REWARDS.find(r => r.id === rewardId);
    if (!targetReward) {
      return NextResponse.json({ error: 'Reward not found in store' }, { status: 404 });
    }

    // 2. Process Redemption (deduct XP)
    const result = db.redeemReward(rewardId, targetReward.cost);

    if (result.success) {
      return NextResponse.json({ success: true, gamification: result.newState }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

  } catch (error) {
    return NextResponse.json({ error: 'Failed to process redemption' }, { status: 500 });
  }
}
