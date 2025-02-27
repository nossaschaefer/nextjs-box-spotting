import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Box from "@/models/Box";

export async function GET(req, { params }) {
  await dbConnect();
  const box = await Box.findById(params.id);
  return box
    ? NextResponse.json(box)
    : NextResponse.json({ error: "Box not found" }, { status: 404 });
}
