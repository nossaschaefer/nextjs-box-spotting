import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/mongodb";
import Box from "@/models/Box";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const boxes = await Box.find({ user: session.user.id });
  return NextResponse.json(boxes);
}

export async function POST(req) {
  await dbConnect();
  console.log("API Route Hit");

  try {
    const session = await getServerSession(authOptions);
    console.log("Session in API Route:", session);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const data = await req.json();
    console.log("Received data:", data);

    const newBox = await Box.create({
      ...data,
      user: session.user.id,
    });

    return NextResponse.json(newBox, { status: 201 });
  } catch (error) {
    console.error("Error creating box:", error);
    return NextResponse.json({ error: "Error creating box" }, { status: 500 });
  }
}
