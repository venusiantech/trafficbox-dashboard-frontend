export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// GET /api/subscription/payment-summary - Get payment summary and usage stats
export async function GET(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward request to backend API
    const response = await fetch(`${backendURL}/subscription/payment-summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch payment summary" },
        { status: response.status }
      );
    }

    // Return response from backend
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching payment summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment summary" },
      { status: 500 }
    );
  }
}

