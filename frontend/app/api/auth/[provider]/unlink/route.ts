import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import axios from "axios";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// TypeScript interface for the session
interface ExtendedSession {
  user: {
    token?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  try {
    // Get session to ensure authentication
    const session = (await getServerSession(
      authOptions
    )) as ExtendedSession | null;
    if (!session || !session.user || !session.user.token) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const provider = params.provider;

    // Call backend API to unlink the account
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const response = await axios.post(
      `${backendUrl}/auth/${provider}/unlink`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.user.token}`,
        },
      }
    );

    // Return the response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Error unlinking ${params.provider} account:`, error);

    return NextResponse.json(
      {
        error:
          error.response?.data?.message ||
          `Failed to unlink ${params.provider} account`,
      },
      { status: error.response?.status || 500 }
    );
  }
}
