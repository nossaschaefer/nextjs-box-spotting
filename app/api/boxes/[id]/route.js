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

export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = await params; // Get box ID from the URL
    await Box.findByIdAndDelete(id);
    return NextResponse.json({ message: "Box deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete box" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect;
  try {
    const { id } = params;
    const updatedData = await req.json();

    const updatedBox = await Box.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedBox) {
      return NextResponse.json({ message: "Box not found" }, { status: 404 });
    }
    return NextResponse.json(updatedBox);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating box", error },
      { status: 500 }
    );
  }
}
