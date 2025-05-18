import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    return NextResponse.json({
      authenticated: !!session,
      session,
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json({
      authenticated: false,
      error: "Failed to get session",
    });
  }
}
