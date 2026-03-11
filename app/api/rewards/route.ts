import { NextResponse } from "next/server"
import { auth } from "../../../lib/auth"
import prisma from "../../../lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const rewards = await prisma.userReward.findMany({
      where: { userId: session.user.id },
      orderBy: { redeemedAt: "desc" }
    })
    
    return NextResponse.json(rewards)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { rewardId, cost } = body

    // 1. Check user XP
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!profile || profile.xp < cost) {
      return new NextResponse("Insufficient XP", { status: 400 })
    }

    // 2. Deduct XP and Create Reward Transaction
    const transaction = await prisma.$transaction([
      prisma.profile.update({
        where: { userId: session.user.id },
        data: { xp: { decrement: cost } }
      }),
      prisma.userReward.create({
        data: {
          userId: session.user.id,
          rewardId,
        }
      })
    ])

    return NextResponse.json(transaction[1])
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
