// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validate input data
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Create the user (without using returning)
    await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role: 'user',
      });
    
    // Fetch the newly created user
    const newUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    return NextResponse.json(
      { 
        message: 'User registered successfully',
        user: { 
          id: newUser?.id,
          name: newUser?.name,
          email: newUser?.email,
        } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}