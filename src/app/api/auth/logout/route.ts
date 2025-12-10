import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear the auth token cookie
  response.cookies.set({
    name: "authToken",
    value: "",
    httpOnly: true,
    maxAge: 0,
  });

  return response;
}
