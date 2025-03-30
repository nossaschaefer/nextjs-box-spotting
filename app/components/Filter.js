"use client";

import { useState } from "react";

export default function Filter({ boxes, setFilteredBoxes }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  function handleFilterByCategory(category) {
    setSelectedCategory(category);

    if (category === "all") {
      setFilteredBoxes(boxes);
    } else {
      const filteredByCategory = boxes.filter(
        (box) => box.boxCategory === category
      );
      setFilteredBoxes(filteredByCategory);
    }
  }

  const categories = [
    "all",
    ...new Set(boxes.map((box) => box.boxCategory).filter(Boolean)),
  ];

  return (
    <div className="pt-2 flex flex-row items-baseline">
      {/* <label>Filter by category</label> */}
      <label className="text-sm">Filter by category</label>

      <select
        value={selectedCategory}
        onChange={(e) => handleFilterByCategory(e.target.value)}
        className="border-2 rounded-md border-rose-300 mt-2 pl-1 ml-2 bg-white text-sm"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category === "all" ? "" : category}
          </option>
        ))}
      </select>
    </div>
  );
}
