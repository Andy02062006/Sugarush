import { NextResponse } from "next/server"
import { auth } from "../../../lib/auth"
import prisma from "../../../lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        profile: true,
      }
    })
    
    return NextResponse.json(user)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { diabetesType, age, targetRangeMin, targetRangeMax } = body

    const updated = await prisma.profile.upsert({
      where: { userId: session.user.id },
      update: { diabetesType, age, targetRangeMin, targetRangeMax },
      create: {
        userId: session.user.id,
        diabetesType,
        age,
        targetRangeMin,
        targetRangeMax,
      }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { name } = body

    if (!name || name.trim() === '') {
      return new NextResponse("Name cannot be empty", { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Failed to update user name:', error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
