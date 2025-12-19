export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// GET /api/campaigns/user/stats - Get user campaign statistics
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

    // Forward request to backend API (Note: This endpoint may not exist in Alpha, using regular endpoint)
    // If this endpoint doesn't exist, it will return an error
    const response = await fetch(`${backendURL}/campaigns/user/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Return response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching user campaign stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch user campaign statistics" },
      { status: 500 }
    );
  }
}

