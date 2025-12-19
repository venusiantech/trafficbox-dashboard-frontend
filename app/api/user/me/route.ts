export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// GET /api/user/me - Get current user profile
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward request to backend API
    const response = await fetch(`${backendURL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Return response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

