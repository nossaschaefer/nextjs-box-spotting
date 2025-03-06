import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Box from "@/models/Box";

export async function GET() {
  await dbConnect();
  const boxes = await Box.find({});
  return NextResponse.json(boxes);
}

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    console.log("Received data:", data);

    const newBox = await Box.create(data);
    return NextResponse.json(newBox, { status: 201 });
  } catch (error) {
    console.error("Error creating box:", error);
    return NextResponse.json({ error: "Error creating box" }, { status: 500 });
  }
}
