import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendURL } from "@/config";

// POST - Create new SEO analysis
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { ok: false, error: "URL is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${backendURL}/blogs/ai/seo-analysis-pro`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: data.error || data.message || "Failed to create SEO analysis" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error creating SEO analysis:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// GET - Get user's SEO analysis history
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized - No token found" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';
    const url = searchParams.get('url');

    // Build query string
    let queryString = `?page=${page}&limit=${limit}`;
    if (url) {
      queryString += `&url=${encodeURIComponent(url)}`;
    }

    const response = await fetch(
      `${backendURL}/blogs/ai/seo-analysis-pro${queryString}`,
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
        { ok: false, error: data.error || data.message || "Failed to fetch SEO analyses" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Error fetching SEO analyses:", error);
    return NextResponse.json(
      { ok: false, error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
