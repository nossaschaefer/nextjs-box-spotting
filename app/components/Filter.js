"use client";

import { useState } from "react";

export default function Filter({ boxes, setFilteredBoxes }) {
  const [selectedCategory, setSelectedCategory] = useState("");

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

  return (
    <div>
      {/* <label>Filter by category</label> */}
      <label>Filter by category</label>
      <select
        value={selectedCategory}
        onChange={(e) => handleFilterByCategory(e.target.value)}
        className="border-2 border-red-300 mt-2 ml-2"
      >
        <option value="all">All</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </div>
  );
}
