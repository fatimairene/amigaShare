import { connectToDatabase } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export async function authenticateUser(
  email: string,
  password: string
): Promise<{
  id: string;
  email: string;
  name: string;
} | null> {
  try {
    const { db } = await connectToDatabase();
    if (!db) {
      return null;
    }

    const user = await db.collection("accounts").findOne({ email });

    if (!user) {
      return null;
    }

    const storedPassword = (user.password as string) || "";
    const isPasswordValid = await bcrypt.compare(password, storedPassword);

    if (!isPasswordValid) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
