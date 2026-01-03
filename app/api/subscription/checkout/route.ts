export const dynamic = "force-dynamic"

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// POST /api/subscription/checkout - Create Stripe checkout session
export async function POST(request: NextRequest) {
  try {
    // Get auth token from cookies
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Forward request to backend API
    const response = await fetch(`${backendURL}/subscription/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to create checkout session" },
        { status: response.status }
      );
    }

    // Return response from backend
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
