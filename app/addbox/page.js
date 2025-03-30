"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";

export default function AddBoxForm() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [boxName, setBoxName] = useState("");
  const [boxItems, setBoxItems] = useState("");
  const [boxLocation, setBoxLocation] = useState("");
  const [boxCategory, setBoxCategory] = useState("");
  const [boxNotes, setBoxNotes] = useState("");
  const [boxImage, setBoxImage] = useState(null);
  const [fileName, setFileName] = useState("Choose file");
  const [boxColor, setBoxColor] = useState("");

  const colorOptions = [
    { value: "bg-lime-300", label: "Lime" },
    { value: "bg-rose-300", label: "Rose" },
    { value: "bg-slate-300", label: "Slate" },
    { value: "bg-blue-200", label: "Blue" },
    { value: "bg-white", label: "White" },
  ];

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
        boxColor,
      }),
    });
    if (res.ok) {
      router.push("/myboxes");
    }
  }

  async function handleImgUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);

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
      <div className="flex  justify-center h-[calc(100vh-4rem)] ">
        <div className="flex flex-col gap-1 min-w-80 text-sm">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col  p-3 rounded-xl mt-4 bg-blue-200"
          >
            <label htmlFor="boxname" className="text-left  mt-6 ">
              Box Name
            </label>
            <input
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
              className="rounded-md px-4"
              required
            />

            <label className="text-left mt-6" htmlFor="addFoto">
              Add Photo
            </label>
            <label className="cursor-pointer rounded-md  px-4 min-w-48 bg-white overflow-hidden text-ellipsis title={filename} whitespace-nowrap">
              {fileName}
              <input
                className="
         file:text-sm file:font-semibold file:text-blue-700 hidden"
                type="file"
                onChange={handleImgUpload}
              />
            </label>

            <label htmlFor="boxitems" className=" text-left mt-6">
              New Item
            </label>
            <input
              value={boxItems}
              onChange={(e) => setBoxItems(e.target.value)}
              placeholder="Items (comma separated)"
              required
              className="rounded-md px-4"
            />

            <label htmlFor="boxlocation" className="text-left mt-6 ">
              Location
            </label>
            <input
              value={boxLocation}
              onChange={(e) => setBoxLocation(e.target.value)}
              className="rounded-md  px-4"
            />

            <label htmlFor="boxcategory" className="text-left mt-6 ">
              Category
            </label>
            <input
              type="text"
              className="rounded-md  px-4"
              value={boxCategory}
              onChange={(e) => setBoxCategory(e.target.value)}
            />

            <label htmlFor="boxnotes" className="text-left mt-6 text-sm">
              Notes
            </label>
            <input
              type="text"
              className="rounded-md  px-4"
              value={boxNotes}
              onChange={(e) => setBoxNotes(e.target.value)}
            />

            <label htmlFor="boxcolor" className="text-left mt-6">
              Background Color
            </label>
            <Select
              value={colorOptions.find((option) => option.value === boxColor)}
              onChange={(selectedOption) => setBoxColor(selectedOption.value)}
              options={colorOptions}
              className="text-left"
              getOptionLabel={(e) => (
                <div className={`${e.value} text-black px-4 rounded-md `}>
                  {e.label}
                </div>
              )}
            />

            <button className="rounded-md p-1 bg-lime-200 mt-6" type="submit">
              Add Box
            </button>
          </form>
        </div>
      </div>
      <div className="mb-40"></div>
    </>
  );
}
