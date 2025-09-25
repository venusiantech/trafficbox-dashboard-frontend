import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = cookies().get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }
    
    // Verify token format
    try {
      const [header, payload, signature] = token.split('.');
      if (!header || !payload || !signature) {
        return NextResponse.json(
          { isAuthenticated: false },
          { status: 200 }
        );
      }
      
      // Check if token is expired
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload.exp && decodedPayload.exp * 1000 < Date.now()) {
        // Token is expired
        return NextResponse.json(
          { isAuthenticated: false },
          { status: 200 }
        );
      }
      
      // Token is valid
      return NextResponse.json(
        { isAuthenticated: true },
        { status: 200 }
      );
    } catch (error) {
      // Invalid token format
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { isAuthenticated: false, error: 'Failed to check authentication status' },
      { status: 500 }
    );
  }
}
