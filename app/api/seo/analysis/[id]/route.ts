import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// GET - Get SEO analysis by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    const analysisId = params.id;

    const response = await fetch(
      `${backendURL}/blogs/ai/seo-analysis-pro/${analysisId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || data.message || "Failed to fetch SEO analysis" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching SEO analysis:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
