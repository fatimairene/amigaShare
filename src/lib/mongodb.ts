import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error('Invalid/missing environment variable: "MONGODB_URI"');
}

interface CachedClient {
  conn: MongoClient | null;
  db: Db | null;
}

let cached: CachedClient = { conn: null, db: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached;
  }

  const client = new MongoClient(MONGODB_URI);
  const conn = await client.connect();
  const db = conn.db("amigashare");

  cached = { conn, db };
  return cached;
}
