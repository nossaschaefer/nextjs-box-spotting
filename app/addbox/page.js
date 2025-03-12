"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddBoxForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [boxName, setBoxName] = useState("");
  const [boxItems, setBoxItems] = useState("");
  const [boxLocation, setBoxLocation] = useState("");
  const [boxCategory, setBoxCategory] = useState("");
  const [boxNotes, setBoxNotes] = useState("");
  const [boxImage, setBoxImage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await fetch("/api/boxes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        boxName,
        boxItems: boxItems.split(",").map((item) => item.trim()),
        boxLocation,
        boxCategory,
        boxNotes,
        boxImage,
      }),
    });
    if (res.ok) {
      setBoxName("");
      setBoxItems("");
      setBoxLocation("");
      setBoxCategory("");
      setBoxNotes("");
      setBoxImage(null);
    }
  }

  async function handleImgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/db4c0554x/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setBoxImage(data.secure_url); // Save Cloudinary image URL
    } catch (error) {
      console.error("Upload failed", error);
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-1 border-2 border-blue-500 p-2 rounded">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="boxname" className="text-left  mt-6">
              Box Name
            </label>
            <input
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="border-2 border-gray-200  px-4"
              required
            />

            <label className="text-left mt-6" htmlFor="">
              Add Photo
            </label>
            <input
              className="border-2 border-gray-200 file:rounded-md
         file:text-sm file:font-semibold file:text-blue-700"
              type="file"
              onChange={handleImgUpload}
            />

            <label htmlFor="boxitems" className="text-left mt-6">
              New Item
            </label>
            <input
              value={boxItems}
              onChange={(e) => setBoxItems(e.target.value)}
              placeholder="Items (comma separated)"
              required
            />

            <label htmlFor="boxlocation" className="text-left mt-6">
              Location
            </label>
            <input
              value={boxLocation}
              onChange={(e) => setBoxLocation(e.target.value)}
              className="border-2 border-gray-200  px-4"
            />

            <label htmlFor="boxcategory" className="text-left mt-6">
              Category
            </label>
            <input
              type="text"
              className="border-2 border-gray-200  px-4"
              value={boxCategory}
              onChange={(e) => setBoxCategory(e.target.value)}
            />

            <label htmlFor="boxnotes" className="text-left mt-6">
              Notes
            </label>
            <input
              type="text"
              className="border-2 border-gray-200  px-4"
              value={boxNotes}
              onChange={(e) => setBoxNotes(e.target.value)}
            />

            <button
              className="rounded-sm p-1 bg-emerald-400 mt-6"
              type="submit"
            >
              Add Box
            </button>
          </form>
        </div>
      </div>
      <div className="mb-20"></div>
    </>
  );
}
