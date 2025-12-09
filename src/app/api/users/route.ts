import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const body = await request.json();

    const user: User = {
      name: body.name,
      surname: body.surname,
      email: body.email,
      birthDate: new Date(body.birthDate),
      description: body.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collection = db.collection("users");
    const result = await collection.insertOne(user as any);

    return NextResponse.json(
      {
        success: true,
        id: result.insertedId,
        message: "User registered successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const collection = db.collection("users");
    const users = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
