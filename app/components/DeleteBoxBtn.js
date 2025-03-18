"use client";

export default function DeleteBoxBtn({ onDelete }) {
  return (
    <button
      onClick={onDelete}
      className="border border-blue-500 p-1 rounded mt-2"
    >
      Delete
    </button>
  );
}
