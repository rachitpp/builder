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
  { params }: { params: { filename: string } }
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

    const filename = params.filename;

    // Call backend API to get the file
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const response = await axios.get(`${backendUrl}/api/files/${filename}`, {
      headers: {
        Authorization: `Bearer ${session.user.token}`,
      },
      responseType: "arraybuffer",
    });

    // Check if the response is successful
    if (response.status !== 200) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Return the file with appropriate content type
    return new NextResponse(response.data, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("Error retrieving file:", error);
    return NextResponse.json(
      { error: error.response?.data?.message || "Failed to retrieve file" },
      { status: error.response?.status || 500 }
    );
  }
}
