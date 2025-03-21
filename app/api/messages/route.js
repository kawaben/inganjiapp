import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Database connection
const db = await mysql.createConnection({
    host: "localhost", 
    user: "root", 
    password: "lbqp25!xaA01", 
    database: "inganjiapp", 
});

// Fetch all messages
export async function GET() {
  try {
    const [messages] = await db.execute("SELECT * FROM contacts ORDER BY id DESC");
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Error fetching messages" }, { status: 500 });
  }
}

// Delete a message
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await db.execute("DELETE FROM contacts WHERE id = ?", [id]);
    return NextResponse.json({ success: true, message: "Message deleted" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Error deleting message" }, { status: 500 });
  }
}
