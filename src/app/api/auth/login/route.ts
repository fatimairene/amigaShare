import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/auth";
import { generateToken } from "@/lib/tokenUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Generate a signed JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    });

    // Set auth token as httpOnly cookie for middleware
    // The secure flag is controlled by SECURE_COOKIES env variable
    // Defaults: true in production, false in development (allows HTTP for local testing)
    // Set SECURE_COOKIES=true in your .env.local if testing with HTTPS locally
    const isSecure =
      process.env.SECURE_COOKIES === "true" ||
      process.env.NODE_ENV === "production";
    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: isSecure,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
