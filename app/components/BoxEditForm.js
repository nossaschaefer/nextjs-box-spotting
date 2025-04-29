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
          className=" w-full p-1 my-1 rounded-md"
          maxLength={24}
        />
      </div>

      <div className="relative overflow-hidden  mb-2 bg-white mt-2  rounded-md">
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
                  className="object-cover rounded-md"
                  src={editedBox.boxImage}
                  fill
                  alt="Box Image"
                  priority
                />
              ) : (
                <div
                  className={`flex items-center justify-center w-full h-full text-gray-500 ${
                    editedBox.boxColor === "bg-white"
                      ? "border border-gray-200 rounded-md"
                      : ""
                  }`}
                >
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
        <span className="font-bold pr-2">Items</span>
        <input
          type="text"
          name="boxItemsInput"
          value={editedBox.boxItemsInput || ""}
          onChange={onChange}
          className=" w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Location</span>
        <input
          type="text"
          name="boxLocation"
          value={editedBox.boxLocation}
          onChange={onChange}
          className=" w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Category</span>
        <input
          type="text"
          name="boxCategory"
          value={editedBox.boxCategory}
          onChange={onChange}
          className=" w-full p-1 my-1 rounded-md"
        />
      </div>

      <div className="flex flex-row items-center">
        <span className="font-bold pr-2 ">Notes</span>
        <input
          type="text"
          name="boxNotes"
          value={editedBox.boxNotes}
          onChange={onChange}
          className=" w-full p-1 my-1 rounded-md"
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
          className={`text-left mt-1 ${
            editedBox.boxColor === "bg-white"
              ? "border border-gray-200 rounded-md"
              : ""
          }`}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              borderRadius: "0.375rem",
              minHeight: "2rem",
              height: "2rem",
              paddingRight: "2rem",
              fontSize: "0.875rem",
              border:
                editedBox.boxColor === "bg-white" ? "1px solid #ccc" : "none",
            }),
            valueContainer: (baseStyles) => ({
              ...baseStyles,
              padding: "0 0.25rem",
            }),
            dropdownIndicator: (baseStyles) => ({
              ...baseStyles,
              padding: "0",
            }),
            option: (baseStyles, state) => ({
              ...baseStyles,
              backgroundColor: state.isSelected
                ? "#f1f5f9"
                : baseStyles.backgroundColor,
              borderRadius: "0.5rem",
              color: "black",
              fontSize: "0.875rem",
            }),
          }}
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
