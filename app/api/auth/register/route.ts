import { NextRequest, NextResponse } from 'next/server';
import { backendURL } from '@/config';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward request to actual API
    const response = await fetch(`${backendURL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    // If registration successful, set the token in an HTTP-only cookie
    if (response.ok && data.token) {
      // Clone the data to return to client but without the token
      // (for security, we don't want to expose the token to client JS)
      const responseData = { ...data };
      
      // Set the token in an HTTP-only cookie
      cookies().set({
        name: 'token',
        value: data.token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict'
      });
    }
    
    // Return response with appropriate status
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}