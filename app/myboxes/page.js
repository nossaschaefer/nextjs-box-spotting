"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import SuccessModal from "../components/SuccessModal";
import { FaList, FaThLarge } from "react-icons/fa";
import Image from "next/image";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBox from "../components/SortableBox";

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
  const [viewModeForBox, setViewModeForBox] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [focusedBoxId, setFocusedBoxId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = boxes.findIndex((box) => box._id === active.id);
      const newIndex = boxes.findIndex((box) => box._id === over.id);

      const movedBoxes = arrayMove(boxes, oldIndex, newIndex);

      const updatedBoxes = movedBoxes.map((box, index) => {
        box.order = index;
        return box;
      });

      setBoxes(updatedBoxes);

      try {
        await fetch("/api/boxes/reorder", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            updatedBoxes.map(({ _id, order }) => ({ _id, order }))
          ),
        });
      } catch (error) {
        console.error("Failed to save box order:", error);
      }
    }
    setFocusedBoxId(active.id);
  }

  console.log("focusedBoxId after drag:", focusedBoxId);
  console.log("boxes after drag:", boxes);

  const handleBoxClick = (boxId) => {
    if (focusedBoxId === boxId) {
      setFocusedBoxId(null);
    } else {
      setFocusedBoxId(boxId);
    }
  };

  const openImage = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const closeImage = () => {
    setSelectedImage(null);
  };

  const toggleView = () => {
    setViewMode(viewMode === "compact" ? "detailed" : "compact");
  };

  const toggleBoxView = (boxId) => {
    setViewModeForBox((prevState) => ({
      ...prevState,
      [boxId]: prevState[boxId] === "compact" ? "detailed" : "compact",
    }));
  };

  useEffect(() => {
    async function fetchBoxes() {
      try {
        const res = await fetch("/api/boxes");
        if (!res.ok) throw new Error("Failed to fetch");
        let data = await res.json();

        data = data.map((box, index) => ({
          ...box,
          order: box.order !== undefined ? box.order : index,
          viewMode: box.viewMode || "compact",
        }));

        data.sort((a, b) => a.order - b.order);

        console.log("fetched boxes:", data);
        setBoxes(data);
        setLoading(false);
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

  if (loading) {
    return <p>Loading boxes...</p>;
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
            {boxes.length} {boxes.length === 1 ? "Box" : "Boxes"}
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
        <DndContext
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={boxes.map((box) => box._id)}
            strategy={verticalListSortingStrategy}
          >
            {boxes.map((box) => (
              <SortableBox
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
                boxViewMode={viewModeForBox[box._id]}
                toggleBoxView={toggleBoxView}
                currentViewMode={viewModeForBox[box._id] || viewMode}
                activeBoxId={activeBoxId}
                toggleModal={toggleModal}
                openImage={openImage}
                isFocused={focusedBoxId === box._id}
                onClick={() => handleBoxClick(box._id)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Modals */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
            onClick={closeImage}
          >
            <div className="relative w-[90vw] h-[90vh]">
              <Image
                src={selectedImage}
                alt="Full Size"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}

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
      <div className="pb-20"></div>
    </>
  );
}
