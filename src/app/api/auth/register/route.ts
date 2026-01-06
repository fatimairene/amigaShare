import { connectToDatabase } from "@/lib/mongodb";
import { validatePasswordStrength } from "@/lib/passwordValidator";
import { getRateLimiter } from "@/lib/rateLimiter";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

// Rate limiter: 5 registration attempts per 15 minutes per IP
const limiter = getRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // Max 5 registration attempts
});

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Check rate limit
    const rateLimitResult = limiter(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Too many registration attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: { "Retry-After": String(rateLimitResult.retryAfter) },
        }
      );
    }

    const { email, password, name } = await request.json();

    // Input validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate password strength
    const validation = validatePasswordStrength(password);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Password does not meet security requirements",
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    // Check if user already exists
    const existingUser = await db.collection("accounts").findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Unable to register with the provided information" },
        { status: 409 }
      );
    }

    // Hashear contraseña
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await db.collection("accounts").insertOne({
      email,
      password: hashedPassword,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Registration failed";
    console.error("Registration error:", errorMessage);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
