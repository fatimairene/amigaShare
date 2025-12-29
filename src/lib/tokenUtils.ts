import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET as string;

// Ensure JWT_SECRET is defined at runtime
if (!JWT_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET environment variable is not defined. Please set it in your .env.local file."
  );
}

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a JWT token
 */
export function generateToken(payload: Omit<TokenPayload, "iat" | "exp">) {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d", // Token expires in 7 days
      algorithm: "HS256",
    });
    return token;
  } catch (error) {
    console.error("Token generation error:", error);
    return null;
  }
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

/**
 * Decode a token without verification (use only for inspection, not validation)
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload | null;
    return decoded;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}
