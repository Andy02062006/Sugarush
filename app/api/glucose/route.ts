import { NextResponse } from "next/server"
import { auth } from "../../../lib/auth"
import prisma from "../../../lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const logs = await prisma.glucoseLog.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "desc" }
    })
    
    return NextResponse.json(logs)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { value, mealType, insulin, notes, timestamp } = body

    const log = await prisma.glucoseLog.create({
      data: {
        userId: session.user.id,
        value,
        mealType,
        insulin,
        notes,
        timestamp: timestamp ? new Date(timestamp) : undefined
      }
    })

    // Optionally increment XP/streak here with an update to Profile
    await prisma.profile.update({
      where: { userId: session.user.id },
      data: { xp: { increment: 10 } }
    });

    return NextResponse.json(log)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
