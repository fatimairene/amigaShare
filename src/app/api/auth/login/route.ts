import { NextRequest, NextResponse } from "next/server";
import { authenticateUser } from "@/auth";
import { generateToken } from "@/lib/tokenUtils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
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
        { message: "Token generation failed" },
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
    response.cookies.set({
      name: "authToken",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
