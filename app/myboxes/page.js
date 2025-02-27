import Link from "next/link";

async function fetchBoxes() {
  const res = await fetch("http://localhost:3000//api/boxes", {
    cache: "no-store",
  });
  return res.json();
}

export default async function MyBoxes() {
  const boxes = await fetchBoxes();

  return (
    <div>
      <h1 className="text-2xl">My Boxes</h1>
      {boxes.length === 0 ? <p>No boxes yet</p> : null}
      {boxes.map((box) => (
        <div key={box._id} className="border p-4 rounded">
          <h2>{box.boxName}</h2>
          <p>Items: {box.boxItems.join(", ")}</p>
          <Link href={`/myboxes/${box._id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
}
