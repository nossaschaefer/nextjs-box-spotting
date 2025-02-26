import dbConnect from "@/lib/mongodb";
import Item from "@/models/Item";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  const items = await Item.find({});
  return NextResponse.json({ success: true, data: items });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const item = await Item.create(body);
  return NextResponse.json({ success: true, data: item }, { status: 201 });
}
