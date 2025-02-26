import { useBoxes } from "./BoxesContext";

export default function MyBoxes() {
  const { boxes } = useBoxes();

  return (
    <>
      <h1 className="pt-4 text-2xl text-indigo-600">My Boxes</h1>
      {boxes.length === 0 ? <p>No boxes yet</p> : null}

      {boxes.map((box, index) => (
        <div
          key={index}
          className="flex flex-col border-2 border-blue-500 p-4 rounded-sm m-4"
        >
          <img className="h-32" src={box.boxImage} alt="" />
          <h2 className="text-2xl">{box.boxName}</h2>
          <p>Items: {box.boxItems.join(", ")}</p>
          <p>Location: {box.boxLocation}</p>
          <p>Category: {box.boxCategory}</p>
          <p>Notes: {box.boxNotes}</p>
        </div>
      ))}
      <div className="mb-20"></div>
    </>
  );
}
