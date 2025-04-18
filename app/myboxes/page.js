"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import { FaList, FaThLarge } from "react-icons/fa";
import BoxDetails from "../components/BoxDetails";

export default function MyBoxes() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [boxes, setBoxes] = useState([]);
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
    console.log("handleChange called");
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
  if (boxes.length === 0) {
    return (
      <div className="flex flex-col items-center w-80 mx-auto">
        <p className="p-2 mt-4">No boxes yet - add a box!</p>
      </div>
    );
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
        {boxes.map((box) => (
          <BoxDetails
            key={box._id}
            box={box}
            isEditing={editBoxId === box._id}
            editedBox={editedBox}
            onEdit={handleEdit}
            onSave={handleSave}
            onChange={handleChange}
            onFileChange={handleFileUpload}
            isUploading={isUploading}
            onDelete={confirmDelete}
            viewMode={viewMode}
            activeBoxId={activeBoxId}
            toggleModal={toggleModal}
            openImage={openImage}
          />
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
