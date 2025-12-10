import { cookies } from "next/headers";
import { verifyToken } from "@/lib/tokenUtils";

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("authToken")?.value;

  if (!authToken) {
    return Response.json({ isAuthenticated: false }, { status: 200 });
  }

  try {
    const decoded = verifyToken(authToken);
    return Response.json(
      {
        isAuthenticated: true,
        user: decoded,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({ isAuthenticated: false }, { status: 200 });
  }
}
