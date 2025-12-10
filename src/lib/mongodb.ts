import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

console.log("MongoDB URI configured:", MONGODB_URI ? "Yes" : "No");

if (!MONGODB_URI) {
  throw new Error('Invalid/missing environment variable: "MONGODB_URI"');
}

interface CachedClient {
  conn: MongoClient | null;
  db: Db | null;
}

let cached: CachedClient = { conn: null, db: null };

export async function connectToDatabase() {
  try {
    if (cached.conn) {
      console.log("Using cached database connection");
      return cached;
    }

    console.log("Creating new MongoDB connection...");
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    const conn = await client.connect();
    console.log("Connected to MongoDB successfully");

    const db = conn.db("amigashare");
    console.log("Connected to database: amigashare");

    cached = { conn, db };
    return cached;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Failed to connect to MongoDB:", errorMessage);
    throw error;
  }
}
