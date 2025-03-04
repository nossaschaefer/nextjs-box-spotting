import Link from "next/link";
import Image from "next/image";
import DeleteBoxBtn from "../components/DeleteBoxBtn";

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
          {box.boxImage && (
            <Image
              src={box.boxImage}
              width={100}
              height={60}
              alt="Box Image"
              priority
            />
          )}

          <h2>{box.boxName}</h2>
          <p>Items: {box.boxItems.join(", ")}</p>
          <p>{box.boxLocation}</p>
          <p>{box.boxCategory}</p>
          <p>{box.boxNotes}</p>
          <DeleteBoxBtn boxId={box._id} />
        </div>
      ))}
    </div>
  );
}
