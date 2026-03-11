import { NextResponse } from "next/server"
import { auth } from "../../../lib/auth"
import prisma from "../../../lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const logs = await prisma.mealLog.findMany({
      where: { userId: session.user.id },
      include: { foods: true },
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
    const { foods, glucoseBeforeMeal, glucoseAfterMeal, notes, timestamp } = body

    // Simple analysis for spike detection
    const spikeAmount = (glucoseAfterMeal && glucoseBeforeMeal) ? (glucoseAfterMeal - glucoseBeforeMeal) : 0;
    const spikeDetected = spikeAmount > 40;

    const log = await prisma.mealLog.create({
      data: {
        userId: session.user.id,
        glucoseBeforeMeal,
        glucoseAfterMeal,
        notes,
        spikeDetected,
        spikeAmount,
        timestamp: timestamp ? new Date(timestamp) : undefined,
        foods: {
          create: foods.map((f: any) => ({
            name: f.name,
            portionSize: f.portionSize,
            estimatedCarbs: f.estimatedCarbs
          }))
        }
      },
      include: { foods: true }
    })

    return NextResponse.json(log)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
