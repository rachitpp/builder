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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const jobId = params.id;

    // Call backend API to get job status
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await axios.get(`${backendUrl}/api/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
    });

    // Return the job status
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error checking job status:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to check job status" },
      { status: error.response?.status || 500 }
    );
  }
}
