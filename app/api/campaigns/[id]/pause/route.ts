import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// POST /api/campaigns/[id]/pause - Pause a campaign
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get auth token from cookies
    const token = cookies().get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Forward request to backend API
    const response = await fetch(`${backendURL}/campaigns/${id}/pause`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Return response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Error pausing campaign ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to pause campaign" },
      { status: 500 }
    );
  }
}
