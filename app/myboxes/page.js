"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import DeleteBoxBtn from "../components/DeleteBoxBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import { FaList, FaThLarge } from "react-icons/fa";

export default function MyBoxes() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [boxes, setBoxes] = useState([]);
  const [expandedBoxes, setExpandedbox] = useState({});
  const [editBoxId, setEditBoxId] = useState(null);
  const [editedBox, setEditedBox] = useState({});
  const [modal, setModal] = useState({
    type: "",
    visible: false,
    boxId: null,
    message: "",
  });
  const [activeBoxId, setActiveBoxId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState("compact");
  const [selectedImage, setSelectedImage] = useState(null);

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const toggleView = () => {
    setViewMode(viewMode === "compact" ? "detailed" : "compact");
  };

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await fetch("/api/boxes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();

        console.log("fetched boxes:", data);
        setBoxes(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchBoxes();
  }, []);

  const handleDelete = async () => {
    const boxId = modal.boxId;
    try {
      const res = await fetch(`/api/boxes/${boxId}`, { method: "DELETE" });
      if (res.ok) {
        setBoxes((prevBoxes) => prevBoxes.filter((box) => box._id !== boxId));
        setModal({
          type: "success",
          visible: true,
          message: "Box successfully deleted",
        });
      } else {
        throw new Error("Failed to delete box");
      }
    } catch (error) {
      console.error(error);
      setModal({
        type: "error",
        visible: true,
        message: "Error deleting the box",
      });
    }
  };

  const confirmDelete = (boxId) => {
    setModal({ type: "confirm", visible: true, boxId });
  };

  const cancelDelete = () => {
    setModal({ type: "", visible: false, boxId: null });
    toggleModal();

    console.log(modal);
  };

  function handleEdit(box) {
    setEditBoxId(box._id);
    setEditedBox({ ...box, boxItemsInput: box.boxItems.join(", ") });
  }

  function handleChange(e) {
    setEditedBox({ ...editedBox, [e.target.name]: e.target.value });
  }

  async function handleSave() {
    const updatedBox = {
      ...editedBox,
      boxItems: editedBox.boxItemsInput.split(",").map((item) => item.trim()),
      boxImage: editedBox.boxImage,
    };

    const res = await fetch(`/api/boxes/${editBoxId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedBox),
    });
    if (res.ok) {
      setBoxes(boxes.map((box) => (box._id === editBoxId ? updatedBox : box)));
      setEditBoxId(null);
    }
    setActiveBoxId(null);
  }

  function toggleExpand(boxId) {
    setExpandedbox((prev) => ({
      ...prev,
      [boxId]: !prev[boxId],
    }));
  }

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

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
      setEditedBox((prev) => ({ ...prev, boxImage: data.secure_url }));
    } catch (error) {
      console.log("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  }

  const toggleModal = (boxId) => {
    setActiveBoxId(activeBoxId === boxId ? null : boxId);
  };

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div className="flex flex-col items-center w-80 mx-auto">
        <div className="flex flex-row justify-between items-center pt-4 w-full">
          <h1 className="text-xl text-black   flex flex-col items-center justify-center sm:flex-row sm:items-start,justify-start">
            {boxes.length} Boxes
          </h1>
          <button
            onClick={toggleView}
            className=" text-black  py-2 rounded  align-baseline "
          >
            {viewMode === "compact" ? (
              <div className="flex flex-row">
                <FaThLarge size={18} className=" text-gray-300" />
                <FaList size={18} className="ml-2" />
              </div>
            ) : (
              <div className="flex flex-row">
                <FaThLarge size={18} className="" />
                <FaList size={18} className="ml-2  text-gray-300" />
              </div>
            )}
          </button>
        </div>
        {boxes.length === 0 ? (
          <p className="p-2 mt-4">No boxes yet - add a box!</p>
        ) : null}
        {boxes.map((box) => (
          <>
            <div
              className={`w-80 p-1  px-3 m-1 shadow-md rounded-2xl ${
                box.boxColor || "bg-white"
              }`}
            >
              {/* Editable Box Name */}
              {editBoxId === box._id ? (
                <div className="flex flex-row items-center">
                  <span className="font-bold pr-2 ">Name</span>
                  <input
                    type="text"
                    name="boxName"
                    value={editedBox.boxName}
                    onChange={handleChange}
                    className="border w-full p-1 my-1 "
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-row justify-between items-center relative ">
                    <h2 className=" text-base text-black font-semibold mt-2 ">
                      {box.boxName}
                    </h2>

                    <button
                      className="mt-2"
                      onClick={() => toggleModal(box._id)}
                    >
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                  </div>
                  {activeBoxId === box._id && !modal.visible && (
                    <div className="flex flex-col bg-white absolute ml-52 p-3 z-10 shadow-lg rounded">
                      <button
                        onClick={() => handleEdit(box)}
                        className="text-black flex flex-row items-center "
                      >
                        <FontAwesomeIcon icon={faPencil} className="mr-2" />
                        Edit
                      </button>
                      <DeleteBoxBtn
                        boxName={box.boxName}
                        boxId={box._id}
                        onDelete={() => confirmDelete(box._id)}
                      />
                    </div>
                  )}
                </>
              )}

              {/* Editable Image */}

              {editBoxId === box._id ? (
                <div className="relative overflow-hidden  mb-2 bg-white mt-2">
                  <div className="flex flex-col min-w-[280px] min-h-[100px]  overflow-hidden">
                    <div className="absolute w-full h-full">
                      <label
                        htmlFor="fileInput"
                        className="cursor-pointer w-full h-full block"
                      >
                        {isUploading ? (
                          <div className="flex justify-center items-center">
                            <div className="animate-spin rounded-full h-8 w-8 mt-8"></div>
                          </div>
                        ) : editedBox.boxImage &&
                          editedBox.boxImage.trim() !== "" ? (
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
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                box.boxImage &&
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
                )
              )}

              {/* Editable Items */}
              {editBoxId === box._id ? (
                <div className="flex flex-row items-center">
                  <span className="font-bold pr-2 ">Items</span>
                  <input
                    type="text"
                    name="boxItemsInput"
                    value={editedBox.boxItemsInput || ""}
                    onChange={handleChange}
                    className="border w-full p-1 my-1"
                  />
                </div>
              ) : (
                viewMode === "detailed" && (
                  <div
                    className="cursor-pointer mt-1"
                    onClick={() => toggleExpand(box._id)}
                  >
                    <p
                      className={`text-sm truncate ${
                        expandedBoxes[box._id]
                          ? "whitespace-normal"
                          : "whitespace-nowrap overflow-hidden"
                      }`}
                    >
                      <span className="font-bold pr-2 text-sm">Items </span>
                      {box.boxItems.join(", ")}
                    </p>
                  </div>
                )
              )}

              {/* Editable Location */}
              {editBoxId === box._id ? (
                <div className="flex flex-row items-center">
                  <span className="font-bold pr-2 ">Location</span>
                  <input
                    type="text"
                    name="boxLocation"
                    value={editedBox.boxLocation}
                    onChange={handleChange}
                    className="border w-full p-1 my-1"
                  />
                </div>
              ) : (
                viewMode === "detailed" && (
                  <p className="text-sm">
                    <span className="font-bold pr-2 text-sm">Location</span>{" "}
                    {box.boxLocation}
                  </p>
                )
              )}

              {/* Editable Category */}
              {editBoxId === box._id ? (
                <div className="flex flex-row items-center">
                  <span className="font-bold pr-2 ">Category</span>
                  <input
                    type="text"
                    name="boxCategory"
                    value={editedBox.boxCategory}
                    onChange={handleChange}
                    className="border w-full p-1 my-1"
                  />
                </div>
              ) : (
                viewMode === "detailed" && (
                  <p className="text-sm">
                    {" "}
                    <span className="font-bold pr-2 text-sm">
                      Category
                    </span>{" "}
                    {box.boxCategory}
                  </p>
                )
              )}

              {/* Editable Notes */}
              {editBoxId === box._id ? (
                <div className="flex flex-row items-center">
                  <span className="font-bold pr-2 ">Notes</span>
                  <input
                    type="text"
                    name="boxNotes"
                    value={editedBox.boxNotes}
                    onChange={handleChange}
                    className="border w-full p-1 my-1"
                  />
                </div>
              ) : (
                viewMode === "detailed" && (
                  <p className="text-sm">
                    <span className="font-bold pr-2 text-sm">Notes</span>
                    {box.boxNotes}
                  </p>
                )
              )}

              {/* Button: Save (when in edit mode)*/}
              <div className="flex flex-row justify-end mt-2">
                {editBoxId === box._id && (
                  <button
                    onClick={handleSave}
                    className="bg-lime-200 text-black p-2 rounded-md"
                  >
                    <FontAwesomeIcon icon={faSave} /> Save
                  </button>
                )}
              </div>
            </div>
          </>
        ))}

        {/* Modals */}
        {modal.type === "confirm" && modal.visible && (
          <ConfirmModal
            isOpen={modal.visible}
            onClose={cancelDelete}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this box?"
          />
        )}
        {modal.type === "success" && (
          <SuccessModal
            isOpen={modal.visible}
            onClose={() => setModal({ type: "", visible: false })}
            message="Box successfully deleted"
          />
        )}

        {modal.type === "error" && (
          <SuccessModal
            isOpen={modal.visible}
            onClose={() => setModal({ type: "", visible: false })}
            message="Error deleting the box"
          />
        )}
      </div>
      <div className="mb-20"></div>
    </>
  );
}
