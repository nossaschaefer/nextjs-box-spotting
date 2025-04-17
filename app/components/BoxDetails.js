import React from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faEllipsisVertical,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import DeleteBoxBtn from "./DeleteBoxBtn";
import BoxEditForm from "./BoxEditForm";

export default function BoxDetails({
  box,
  isEditing,
  editedBox,
  onEdit,
  onSave,
  onChange,
  onFileChange,
  isUploading,
  onDelete,
  viewMode,
  activeBoxId,
  toggleModal,
  openImage,
}) {
  return (
    <div
      className={`w-80 p-1  px-3 m-1 shadow-md rounded-2xl ${
        box.boxColor || "bg-white"
      }`}
    >
      {/* Editable Box */}
      {isEditing ? (
        <BoxEditForm
          editedBox={editedBox}
          onChange={onChange}
          onClick={onSave}
          isUploading={isUploading}
          onFileChange={onFileChange}
        />
      ) : (
        <>
          <div className="flex flex-row justify-between items-center relative ">
            <h2 className=" text-base text-black font-semibold mt-2 ">
              {box.boxName}
            </h2>
            <button className="mt-2" onClick={() => toggleModal(box._id)}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
          </div>
          {activeBoxId === box._id && (
            <div className="flex flex-col bg-white absolute ml-52 p-3 z-10 shadow-lg rounded">
              <button
                onClick={() => onEdit(box)}
                className="text-black flex flex-row items-center "
              >
                <FontAwesomeIcon icon={faPencil} className="mr-2" />
                Edit
              </button>
              <DeleteBoxBtn
                boxName={box.boxName}
                boxId={box._id}
                onDelete={() => onDelete(box._id)}
              />
            </div>
          )}
          {box.boxImage &&
            box.boxImage.trim() !== "" &&
            viewMode === "detailed" && (
              <div
                className="relative overflow-hidden  mb-2 bg-white mt-2 cursor-pointer"
                onClick={() => openImage(box.boxImage)}
              >
                <div className="flex flex-col min-w-[280px] min-h-[100px]  overflow-hidden">
                  <div className="absolute w-full h-full">
                    <Image
                      className="object-cover rounded-sm"
                      src={box.boxImage}
                      fill
                      alt="Box Image"
                      priority
                    />
                  </div>
                </div>
              </div>
            )}
          {viewMode === "detailed" && (
            <>
              <div className="text-sm">
                <p>
                  <span className="font-bold pr-2">Items </span>
                  {box.boxItems.join(", ")}
                </p>
              </div>
              <p className="text-sm">
                <span className="font-bold pr-2 text-sm">Location</span>{" "}
                {box.boxLocation}
              </p>
              <p className="text-sm">
                {" "}
                <span className="font-bold pr-2 text-sm">Category</span>{" "}
                {box.boxCategory}
              </p>
              <p className="text-sm">
                <span className="font-bold pr-2 text-sm">Notes</span>
                {box.boxNotes}
              </p>
              {/* BG color */}
            </>
          )}
        </>
      )}

      {/* Button: Save (when in edit mode)*/}
      <div className="flex flex-row justify-end mt-2">
        {isEditing && (
          <button
            onClick={onSave}
            className="bg-lime-200 text-black p-2 rounded-md"
          >
            <FontAwesomeIcon icon={faSave} /> Save
          </button>
        )}
      </div>
    </div>
  );
}
