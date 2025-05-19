import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;

    // Get the redirect URI from the query string
    const { searchParams } = new URL(request.url);
    const redirectUri = searchParams.get("redirectUri");

    if (!redirectUri) {
      return NextResponse.json(
        { error: "Missing redirectUri parameter" },
        { status: 400 }
      );
    }

    // Call backend API to get the authorization URL
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await axios.get(
      `${backendUrl}/auth/${provider}/url?redirectUri=${encodeURIComponent(
        redirectUri
      )}`
    );

    // Return the authorization URL
    return NextResponse.json({
      authorizationUrl: response.data.authorizationUrl,
    });
  } catch (error: any) {
    console.error(`Error getting ${params.provider} auth URL:`, error);

    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          `Failed to get ${params.provider} authorization URL`,
      },
      { status: error.response?.status || 500 }
    );
  }
}
