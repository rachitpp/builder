import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;

    // Get the code and redirectUri from the query string
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    const action = searchParams.get("action") || "login";

    // Handle error cases
    if (error) {
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL(`/login?error=${error}&provider=${provider}`, request.url)
      );
    }

    if (!code) {
      // Redirect to login page with error
      return NextResponse.redirect(
        new URL(`/login?error=missing_code&provider=${provider}`, request.url)
      );
    }

    // Set correct redirect target based on action
    let redirectTarget;
    if (action === "link") {
      // For account linking, redirect back to profile
      redirectTarget = `/dashboard/profile?code=${code}&provider=${provider}&action=link`;
    } else {
      // For login, redirect to login page with code
      redirectTarget = `/login?code=${code}&provider=${provider}`;
    }

    // Redirect to the appropriate page
    return NextResponse.redirect(new URL(redirectTarget, request.url));
  } catch (error: any) {
    console.error(`Error handling ${params.provider} callback:`, error);

    // Redirect to login page with error
    return NextResponse.redirect(
      new URL(
        `/login?error=callback_failed&provider=${params.provider}`,
        request.url
      )
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    const provider = params.provider;
    const body = await request.json();
    const { code, redirectUri } = body;

    console.log(`POST ${provider} auth callback received`, {
      hasCode: !!code,
      redirectUri,
    });

    if (!code || !redirectUri) {
      return NextResponse.json(
        { success: false, error: "Missing code or redirectUri" },
        { status: 400 }
      );
    }

    // Get the backend API URL
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    console.log(
      `Sending ${provider} auth code to backend: ${backendUrl}/auth/${provider}/callback`
    );

    try {
      // Make request to backend
      const response = await axios.get(
        `${backendUrl}/auth/${provider}/callback?code=${encodeURIComponent(
          code
        )}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      // Log successful response info
      console.log(`${provider} auth successful:`, {
        success: true,
        status: response.status,
        userId: response.data?.user?.id || "unknown",
      });

      // Extract the token and refreshToken from the response
      const { token, refreshToken, user } = response.data;

      // Create a JSON response
      return NextResponse.json({
        success: true,
        token,
        refreshToken,
        user,
      });
    } catch (backendError: any) {
      console.error(`Backend ${provider} auth error:`, {
        status: backendError.response?.status,
        message: backendError.message,
        data: backendError.response?.data,
      });

      return NextResponse.json(
        {
          success: false,
          error: backendError.response?.data?.message || backendError.message,
          details: backendError.response?.data,
        },
        { status: backendError.response?.status || 500 }
      );
    }
  } catch (error: any) {
    console.error(`POST ${params.provider} callback processing error:`, error);

    return NextResponse.json(
      {
        success: false,
        error: `Failed to process authentication: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
