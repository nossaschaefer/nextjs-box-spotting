"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import DeleteBoxBtn from "../components/DeleteBoxBtn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function MyBoxes() {
  const [boxes, setBoxes] = useState([]);

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

            <h2 className="text-xl text-indigo-500">{box.boxName}</h2>
            <p>Items: {box.boxItems.join(", ")}</p>
            <p>Location: {box.boxLocation}</p>
            <p>Category: {box.boxCategory}</p>
            <p>Notes: {box.boxNotes}</p>
            <div className="flex flex-row justify-between items-center">
              <DeleteBoxBtn boxId={box._id} onDelete={handleDelete} />
              <Link href="/editbox">
                <FontAwesomeIcon icon={faPencil} />
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="mb-20"></div>
    </>
  );
}
