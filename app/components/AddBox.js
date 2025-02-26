"use client";

import { useState } from "react";
import { useBoxes } from "./BoxesContext";

export default function AddBox() {
  const { addNewBox } = useBoxes();

  const [boxName, setBoxName] = useState("");
  const [newItem, setNewItem] = useState(""); //item, der neu reingeschrieben wird
  const [boxItems, setBoxItems] = useState([]);
  const [boxLocation, setBoxLocation] = useState("");
  const [boxCategory, setBoxCategory] = useState("");
  const [boxNotes, setBoxNotes] = useState("");
  const [boxImage, setBoxImage] = useState(null);

  function handleAddBox() {
    if (!boxName.trim()) return;
    const newBox = {
      boxName,
      boxItems,
      boxLocation,
      boxCategory,
      boxNotes,
      boxImage,
    };
    addNewBox(newBox);
    resetForm();
  }

  function resetForm() {
    setBoxName("");
    setNewItem("");
    setBoxItems([]);
    setBoxLocation("");
    setBoxCategory("");
    setBoxNotes("");
    setBoxImage(null);
  }

  function handleAddItem(e) {
    e.preventDefault(); // Prevent form submission
    if (newItem.trim()) {
      setBoxItems((prevItems) => [...prevItems, newItem]);
      setNewItem("");
    }
  }

  function handleImgUpload(e) {
    console.log(e.target.files);
    setBoxImage(URL.createObjectURL(e.target.files[0]));
  }
  return (
    <>
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-1 border-2 border-blue-500 p-2 rounded">
          <form action="" className="flex flex-col">
            <label htmlFor="boxname" className="text-left  mt-6">
              Box Name
            </label>
            <input
              type="text"
              className="border-2 border-gray-200  px-4"
              value={boxName}
              onChange={(e) => setBoxName(e.target.value)}
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
              <button
                className="ml-32 bg-violet-300 rounded-sm p-1"
                onClick={handleAddItem}
              >
                Add
              </button>
            </label>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              className="border-2 border-gray-200  px-4"
            />

            <label htmlFor="boxlocation" className="text-left mt-6">
              Location
            </label>
            <input
              type="text"
              className="border-2 border-gray-200  px-4"
              value={boxLocation}
              onChange={(e) => setBoxLocation(e.target.value)}
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
          </form>
          <button
            onClick={handleAddBox}
            className="rounded-sm p-1 bg-emerald-400 mt-6"
          >
            Add box
          </button>
        </div>
      </div>
    </>
  );
}
