"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import DeleteBoxBtn from "../components/DeleteBoxBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";

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

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await fetch("/api/boxes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
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
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl ml-2 mt-4">My Boxes</h1>
        {boxes.length === 0 ? (
          <p className="p-2 mt-4">No boxes yet - add a box!</p>
        ) : null}
        {boxes.map((box) => (
          <div
            key={box._id}
            className="border p-4 border-violet-500 m-2 rounded bg-white"
          >
            {/* Editable Image */}
            <div className="min-w-[280px] min-h-[100px] relative overflow-hidden border-2 border-red-400 mb-2 bg-white">
              {editBoxId === box._id ? (
                <div className="flex flex-col">
                  {editedBox.boxImage ? (
                    <div className="absolute w-full h-full">
                      <Image
                        className="object-cover"
                        src={editedBox.boxImage}
                        fill
                        alt="Box Image"
                        priority
                      />
                      <button
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                        className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded border border-red-500"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div>
                      <button
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                        className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded border border-red-500"
                      >
                        <FontAwesomeIcon icon={faPencil} />
                      </button>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <p>No image uploaded</p>
                    </div>
                  )}
                </div>
              ) : (
                box.boxImage && (
                  <Image
                    className="object-cover"
                    src={box.boxImage}
                    fill
                    alt="Box Image"
                    priority
                  />
                )
              )}
            </div>

            {/* Editable Box Name */}
            {editBoxId === box._id ? (
              <div className="flex flex-row items-center">
                <span className="font-bold pr-2 ">Name</span>
                <input
                  type="text"
                  name="boxName"
                  value={editedBox.boxName}
                  onChange={handleChange}
                  className="border w-full p-1 my-1"
                />
              </div>
            ) : (
              <h2 className="text-xl text-indigo-500">{box.boxName}</h2>
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
              <div
                className="cursor-pointer mt-1"
                onClick={() => toggleExpand(box._id)}
              >
                <p
                  className={`truncate ${
                    expandedBoxes[box._id]
                      ? "whitespace-normal"
                      : "whitespace-nowrap overflow-hidden"
                  }`}
                >
                  <span className="font-bold pr-2">Items </span>
                  {box.boxItems.join(", ")}
                </p>
              </div>
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
              <p>
                <span className="font-bold pr-2">Location</span>{" "}
                {box.boxLocation}
              </p>
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
              <p>
                {" "}
                <span className="font-bold pr-2">Category</span>{" "}
                {box.boxCategory}
              </p>
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
              <p>
                {" "}
                <span className="font-bold pr-2">Notes</span> {box.boxNotes}
              </p>
            )}

            {/* Buttons: Delete & Edit */}
            <div className="flex flex-row justify-between items-center">
              <DeleteBoxBtn
                boxName={box.boxName}
                boxId={box._id}
                onDelete={() => confirmDelete(box._id)}
              />

              {editBoxId === box._id ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white p-2 rounded"
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(box)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  <FontAwesomeIcon icon={faPencil} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Modals */}
        {modal.type === "confirm" && (
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
