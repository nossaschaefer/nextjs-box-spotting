import React from "react";
import Image from "next/image";
import Select from "react-select";

const colorOptions = [
  { value: "bg-lime-300", label: "Lime" },
  { value: "bg-rose-300", label: "Rose" },
  { value: "bg-slate-300", label: "Slate" },
  { value: "bg-blue-200", label: "Blue" },
  { value: "bg-white", label: "White" },
];

export default function BoxEditForm({
  editedBox,
  onChange,
  onClick,
  isUploading,
  onFileChange,
}) {
  return (
    <div>
      <div className="flex flex-row items-center mt-2">
        <span className="font-bold pr-2 ">Name</span>
        <input
          type="text"
          name="boxName"
          value={editedBox.boxName}
          onChange={onChange}
          className="border w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="relative overflow-hidden  mb-2 bg-white mt-2">
        <div className="flex flex-col min-w-[280px] min-h-[100px]  overflow-hidden">
          <div className="absolute w-full h-full">
            <label
              htmlFor="fileInput"
              className="cursor-pointer w-full h-full block"
            >
              {isUploading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-200 mt-8"></div>
                </div>
              ) : editedBox.boxImage && editedBox.boxImage.trim() !== "" ? (
                <Image
                  className="object-cover rounded-sm"
                  src={editedBox.boxImage}
                  fill
                  alt="Box Image"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-500">
                  Click to upload an image
                </div>
              )}
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Items</span>
        <input
          type="text"
          name="boxItemsInput"
          value={editedBox.boxItemsInput || ""}
          onChange={onChange}
          className="border w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Location</span>
        <input
          type="text"
          name="boxLocation"
          value={editedBox.boxLocation}
          onChange={onChange}
          className="border w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Category</span>
        <input
          type="text"
          name="boxCategory"
          value={editedBox.boxCategory}
          onChange={onChange}
          className="border w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Notes</span>
        <input
          type="text"
          name="boxNotes"
          value={editedBox.boxNotes}
          onChange={onChange}
          className="border w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center gap-3 ">
        <span className="font-bold ">Color</span>

        <Select
          value={colorOptions.find(
            (option) => option.value === editedBox.boxColor
          )}
          onChange={(selectedOption) =>
            onChange({
              target: { name: "boxColor", value: selectedOption.value },
            })
          }
          options={colorOptions}
          className="text-left mt-1 "
          getOptionLabel={(e) => (
            <div className={`${e.value} text-black px-4 rounded-md pr-32 `}>
              {e.label}
            </div>
          )}
        />
      </div>
    </div>
  );
}
