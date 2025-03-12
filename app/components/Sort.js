"use client";

import { useState } from "react";

export default function Sort({ filteredBoxes, setFilteredBoxes }) {
  const [isAscending, setIsAscending] = useState(true);

  function handleAlphabeticSort() {
    const sortedBoxes = [...filteredBoxes].sort((a, b) =>
      isAscending
        ? a.boxName.localeCompare(b.boxName)
        : b.boxName.localeCompare(a.boxName)
    );
    setFilteredBoxes(sortedBoxes);
    setIsAscending(!isAscending);
  }

  return (
    <div>
      <button
        className="border-2 border-red-300 mt-2 ml-2"
        onClick={handleAlphabeticSort}
      >
        Sort by boxname {isAscending ? "↑" : "↓"}
      </button>
    </div>
  );
}
