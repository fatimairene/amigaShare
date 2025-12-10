/**
 * Simple JWT verification for Edge Runtime (Middleware)
 * Since Node.js crypto is not available in edge runtime,
 * we use Web Crypto API which is available globally
 */

export interface TokenPayload {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Verify JWT token using Web Crypto API (available in edge runtime)
 * This is a simplified verification that checks:
 * 1. Token format is valid (3 parts separated by dots)
 * 2. Token is not expired
 * 3. Signature is valid (using HMAC-SHA256)
 */
export async function verifyTokenEdge(
  token: string,
  secret: string
): Promise<TokenPayload | null> {
  try {
    // Split token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const [headerEncoded, payloadEncoded, signatureEncoded] = parts;

    // Decode payload
    const payloadJson = atob(payloadEncoded);
    const payload = JSON.parse(payloadJson) as TokenPayload;

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // Token expired
    }

    // Verify signature using Web Crypto API
    const secretBuffer = new TextEncoder().encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      secretBuffer,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign", "verify"]
    );

    const messageBuffer = new TextEncoder().encode(
      `${headerEncoded}.${payloadEncoded}`
    );
    const signatureBuffer = Uint8Array.from(
      atob(signatureEncoded.replace(/-/g, "+").replace(/_/g, "/")),
      (c) => c.charCodeAt(0)
    );

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBuffer,
      messageBuffer
    );

    if (!isValid) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}
