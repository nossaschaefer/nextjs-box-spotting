"use client";
import { useRouter } from "next/navigation";

export default function DeleteBoxBtn({ boxId, onDelete, boxName }) {
  const router = useRouter();
  async function deleteBox() {
    const res = await fetch(`/api/boxes/${boxId}`, { method: "DELETE" });
    if (res.ok) {
      onDelete(boxId);
      alert(`Box ${boxName} deleted.`);
    } else {
      console.log("Failed to delete box");
    }
  }
  return (
    <button
      onClick={deleteBox}
      className="border border-blue-500 p-1 rounded mt-2"
    >
      Delete
    </button>
  );
}
