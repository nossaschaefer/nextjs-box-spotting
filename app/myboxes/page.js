"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import DeleteBoxBtn from "../components/DeleteBoxBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-solid-svg-icons";

export default function MyBoxes() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [boxes, setBoxes] = useState([]);
  const [expandedBoxes, setExpandedbox] = useState({});
  const [editBoxId, setEditBoxId] = useState(null);
  const [editedBox, setEditedBox] = useState({});

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

  const handleDelete = (deletedBoxId) => {
    setBoxes((prevBoxes) =>
      prevBoxes.filter((box) => box._id !== deletedBoxId)
    );
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

  if (status === "loading") return <p>Loading...</p>;
  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <>
      <div>
        <h1 className="text-2xl ml-2">My Boxes</h1>
        {boxes.length === 0 ? <p>No boxes yet</p> : null}
        {boxes.map((box) => (
          <div
            key={box._id}
            className="border p-4 border-violet-500 m-2 rounded"
          >
            <div className="min-w-[280px] min-h-[100px] relative overflow-hidden border-2 border-red-400 mb-2">
              {box.boxImage && (
                <Image
                  className="object-cover"
                  src={box.boxImage}
                  fill
                  alt="Box Image"
                  priority
                />
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
                  className="border w-full p-1"
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
                  className="border w-full p-1"
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
                  className="border w-full p-1"
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
                  className="border w-full p-1"
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
                  className="border w-full p-1"
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
                onDelete={handleDelete}
              />

              {editBoxId === box._id ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white p-2"
                >
                  <FontAwesomeIcon icon={faSave} /> Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(box)}
                  className="bg-blue-500 text-white p-2"
                >
                  <FontAwesomeIcon icon={faPencil} /> Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20"></div>
    </>
  );
}
