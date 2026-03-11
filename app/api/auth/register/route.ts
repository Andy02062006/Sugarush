import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name, diabetesType, age, minTarget, maxTarget } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new User and Profile row within Prisma
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'User',
        profile: {
          create: {
            diabetesType: diabetesType || 'Type 2',
            age: age ? parseInt(age.toString()) : 35,
            targetRangeMin: minTarget ? parseInt(minTarget.toString()) : 70,
            targetRangeMax: maxTarget ? parseInt(maxTarget.toString()) : 140,
            xp: 100, // Give them a welcome bonus
            streak: 0,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    // Strip out the password before responding
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 });
  }
}
