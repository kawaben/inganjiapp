import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const db = await mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "lbqp25!xaA01", 
  database: "inganjiapp", 
});

// Handle POST requests
export async function POST(req) {
  try {
    // Parse JSON request body
    const { name, email, message } = await req.json();

    // Insert data into MySQL database
    await db.execute("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)", [
      name,
      email,
      message,
    ]);

    return NextResponse.json({ success: true, message: "Message saved successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ success: false, message: "Error saving message" }, { status: 500 });
  }
}
