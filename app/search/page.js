"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Sort from "../components/Sort";
import Filter from "../components/Filter";
import Image from "next/image";

export default function Search() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [boxes, setBoxes] = useState([]);
  const [filteredBoxes, setFilteredBoxes] = useState([]);

  useEffect(() => {
    async function fetchBoxes() {
      const res = await fetch("/api/boxes");
      if (res.ok) {
        const data = await res.json();
        setBoxes(data);
        setFilteredBoxes(data);
      }
    }
    fetchBoxes();
  }, []);

  function handleSearch(e) {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const results = boxes.filter(
      (box) =>
        box.boxName.toLowerCase().includes(value) ||
        box.boxItems.some((item) => item.toLowerCase().includes(value)) ||
        box.boxLocation.toLowerCase().includes(value) ||
        box.boxCategory.toLowerCase().includes(value)
    );
    setFilteredBoxes(results);
  }

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="p-4 pt-4 flex flex-col items-center justify-center text-left">
      <label htmlFor="search"></label>
      <input
        placeholder=" Search"
        id="search"
        type="text"
        value={search}
        onChange={handleSearch}
        className="border-2  border-blue-500 rounded-md placeholder:text-gray-400 mt-2 px-3"
      />

      <Sort filteredBoxes={filteredBoxes} setFilteredBoxes={setFilteredBoxes} />
      <Filter boxes={boxes} setFilteredBoxes={setFilteredBoxes} />

      <div className="mt-4">
        {filteredBoxes.length === 0 ? <p>No results found</p> : null}
        {filteredBoxes.map((box) => (
          <div
            key={box._id}
            className={`w-80  p-3 m-2 shadow-md rounded-2xl ${
              box.boxColor || "bg-white"
            }`}
          >
            <h2 className="text-base font-semibold">{box.boxName}</h2>
            {box.boxImage && box.boxImage.trim() !== "" && (
              <div className="relative flex flex-col min-w-[280px] min-h-[100px]  overflow-hidden">
                <Image
                  className="object-cover rounded-sm  mt-1"
                  src={box.boxImage}
                  fill
                  alt="Box Image"
                  priority
                />
              </div>
            )}
            <p className="text-sm mt-1">
              <span className="font-bold "> Items:</span>{" "}
              {Array.isArray(box.boxItems)
                ? box.boxItems.join(", ")
                : box.boxItems}
            </p>
            <p className="text-sm">
              {" "}
              <span className="font-bold ">Location:</span> {box.boxLocation}
            </p>
            <p className="text-sm">
              <span className="font-bold ">Category:</span> {box.boxCategory}
            </p>
            <p className="text-sm">
              <span className="font-bold ">Notes:</span> {box.boxNotes}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-20"></div>
    </div>
  );
}
