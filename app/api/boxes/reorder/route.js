import { NextResponse } from "next/server";
import Box from "@/models/Box";
import dbConnect from "@/lib/mongodb";

export async function PUT(req) {
  await dbConnect();

  try {
    const boxes = await req.json();
    console.log(boxes);

    if (!Array.isArray(boxes)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    const updatePromises = boxes.map((box) =>
      Box.findByIdAndUpdate(box._id, { order: box.order }, { new: true })
    );

    await Promise.all(updatePromises);

    return NextResponse.json(
      { message: "Boxes reordered successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering boxes:", error);
    return NextResponse.json(
      { message: "Error reordering boxes" },
      { status: 500 }
    );
  }
}
