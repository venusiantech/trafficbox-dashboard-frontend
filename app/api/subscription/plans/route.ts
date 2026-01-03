export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server";
import { backendURL } from "@/config";

// GET /api/subscription/plans - Get all subscription plans
export async function GET(request: NextRequest) {
  try {
    // Forward request to backend API (no auth required)
    const response = await fetch(`${backendURL}/subscription/plans`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to fetch plans" },
        { status: response.status }
      );
    }

    // Return response from backend
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching subscription plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription plans" },
      { status: 500 }
    );
  }
}
