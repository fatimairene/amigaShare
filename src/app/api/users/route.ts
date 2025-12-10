import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/types/user";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

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
    console.log("Attempting to connect to database...");
    const { db } = await connectToDatabase();

    if (!db) {
      console.error("Database object is null");
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    console.log("Connected to database, fetching users...");
    const collection = db.collection("users");
    const users = await collection.find({}).sort({ createdAt: -1 }).toArray();

    console.log(`Successfully fetched ${users.length} users`);
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : "";
    console.error("Error fetching users:", errorMessage);
    console.error("Stack:", errorStack);
    return NextResponse.json(
      {
        error: "Failed to fetch users",
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { _id, name, surname, email, birthDate, description } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const collection = db.collection("users");
    const result = await collection.updateOne(
      { _id: new ObjectId(_id) },
      {
        $set: {
          name,
          surname,
          email,
          birthDate: birthDate ? new Date(birthDate) : undefined,
          description,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const collection = db.collection("users");
    const result = await collection.deleteOne({ _id: new ObjectId(_id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
