import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Box from "@/models/Box";
import cloudinary from "@/lib/cloudinary";

export async function GET(req, { params }) {
  await dbConnect();
  const box = await Box.findById(params.id);
  return box
    ? NextResponse.json(box)
    : NextResponse.json({ error: "Box not found" }, { status: 404 });
}

export async function DELETE(req, { params }) {
  // console.log("DELETE request received for box ID:", params.id);
  await dbConnect();

  try {
    const { id } = await params;

    const box = await Box.findById(id);
    if (!box) {
      return NextResponse({ error: "Box not found" }, { status: 404 });
    }
    console.log("Box found:", box);
    console.log("Image URL:", box.boxImage);

    if (box.boxImage) {
      try {
        const fileName = box.boxImage.split("/").slice(-1).join();
        const publicId = fileName.slice(0, fileName.lastIndexOf("."));
        console.log("Public ID:", publicId);
        cloudinary.uploader
          .destroy(publicId)
          .then((result) => console.log(result));
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
      }
    }

    await Box.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Box and image deleted" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete box and image" },
      { status: 500 }
    );
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = await params;
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
