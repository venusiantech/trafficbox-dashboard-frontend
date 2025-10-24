import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// GET /api/campaigns/[id]/stats - Get campaign statistics
export async function GET(
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

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Build URL with query params (Alpha endpoint)
    const url = new URL(`${backendURL}/alpha/campaigns/${id}/stats`);
    if (from) url.searchParams.append("from", from);
    if (to) url.searchParams.append("to", to);

    // Forward request to backend API
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // Return response from backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error(`Error fetching campaign stats ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch campaign statistics" },
      { status: 500 }
    );
  }
}

