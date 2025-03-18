"use client";

import { useState } from "react";

export default function Sort({ filteredBoxes, setFilteredBoxes }) {
  const [isAscending, setIsAscending] = useState(false);
  const [sortCriteria, setSortCriteria] = useState("boxName");

  function sortBoxes(criteria, isAscending) {
    const sortedBoxes = [...filteredBoxes].sort((a, b) =>
      isAscending
        ? a[criteria].localeCompare(b[criteria])
        : b[criteria].localeCompare(a[criteria])
    );
    setFilteredBoxes(sortedBoxes);
  }

  function handleSortChange(event) {
    const newCriteria = event.target.value;
    setSortCriteria(newCriteria);
    setIsAscending(false);
    sortBoxes(newCriteria, false);
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
    sortBoxes(sortCriteria, !isAscending);
  }

  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="sort">Sort by</label>
      <select
        id="sort"
        className="border p-1"
        value={sortCriteria}
        onChange={handleSortChange}
      >
        <option value="boxName">Box Name</option>
        <option value="boxCategory">Category</option>
      </select>

      <button
        className="border-2 border-red-300 mt-2 ml-2"
        onClick={toggleSortOrder}
      >
        {isAscending ? "↑" : "↓"}
      </button>
    </div>
  );
}
