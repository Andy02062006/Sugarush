import { NextResponse } from "next/server"
import { auth } from "../../../../lib/auth"
import prisma from "../../../../lib/prisma"

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 })

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: session.user.id },
      orderBy: { timestamp: "asc" }
    })
    
    return NextResponse.json(messages)
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 })
  }
}
