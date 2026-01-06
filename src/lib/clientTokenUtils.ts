/**
 * Client-side token validation utility
 * Note: This is for display purposes only. Always validate on the server.
 */

export interface DecodedToken {
  id: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
}

/**
 * Decode a JWT token on the client side (without verification)
 * WARNING: This does NOT verify the token signature.
 * Always verify tokens on the server side!
 */
export function decodeTokenClient(token: string): DecodedToken | null {
  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = atob(parts[1]);
    return JSON.parse(payload) as DecodedToken;
  } catch (error) {
    console.error("Token decode error:", error);
    return null;
  }
}

/**
 * Check if a token is expired (client-side check only)
 * Always validate on the server for security!
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeTokenClient(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  // exp is in seconds, convert to milliseconds
  const expirationTime = decoded.exp * 1000;
  return Date.now() >= expirationTime;
}

/**
 * Get the remaining time until token expires (in seconds)
 */
export function getTokenExpiry(token: string): number {
  const decoded = decodeTokenClient(token);
  if (!decoded || !decoded.exp) {
    return 0;
  }

  const remainingTime = decoded.exp - Math.floor(Date.now() / 1000);
  return Math.max(0, remainingTime);
}
