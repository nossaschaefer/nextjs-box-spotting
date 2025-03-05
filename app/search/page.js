"use client";
import { useState, useEffect } from "react";

export default function Search() {
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

  return (
    <div className="p-4 mt-4 flex flex-col text-left px-16">
      <label htmlFor="search"></label>
      <input
        placeholder=" Search"
        id="search"
        type="text"
        value={search}
        onChange={handleSearch}
        className="border-2  border-blue-500 rounded placeholder:text-gray-400 mt-2"
      />
      <div className="mt-4">
        {filteredBoxes.length === 0 ? <p>No results found</p> : null}
        {filteredBoxes.map((box) => (
          <div key={box._id} className="border p-2 mt-2">
            <h2 className="text-lg font-semibold">{box.boxName}</h2>
            <p>Location: {box.boxLocation}</p>
            <p>Category: {box.boxCategory}</p>
            <p>
              Items:{" "}
              {Array.isArray(box.boxItems)
                ? box.boxItems.join(", ")
                : box.boxItems}
            </p>
          </div>
        ))}
      </div>
      <div className="mb-20"></div>
    </div>
  );
}
