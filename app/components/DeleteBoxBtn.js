"use client";

export default function DeleteBoxBtn({ boxId }) {
  async function deleteBox() {
    const res = await fetch(`/api/boxes/${boxId}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    }
  }
  return (
    <button onClick={deleteBox} className="border border-blue-500 p-1 rounded">
      Delete
    </button>
  );
}
