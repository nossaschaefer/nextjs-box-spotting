"use client";

import { useState } from "react";

export default function Sort({ filteredBoxes, setFilteredBoxes }) {
  const [isAscending, setIsAscending] = useState(true);
  const [sortCriteria, setSortCriteria] = useState("");

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

    if (newCriteria) {
      setIsAscending(true);
      sortBoxes(newCriteria, true);
    }
  }

  function toggleSortOrder() {
    setIsAscending(!isAscending);
    sortBoxes(sortCriteria, !isAscending);
  }

  return (
    <div className="flex  gap-2 items-baseline justify-center pt-3">
      <label htmlFor="sort">Sort by</label>
      <select
        id="sort"
        className=" border-2 border-rose-300  rounded-md bg-white text-sm p-1"
        value={sortCriteria}
        onChange={handleSortChange}
      >
        <option value=""></option>
        <option value="boxName">Box Name</option>
        <option value="boxCategory">Category</option>
        <option value="boxLocation">Location</option>
      </select>

      <button
        className="border-2 border-rose-300 rounded mt-2 ml-2 bg-white"
        onClick={toggleSortOrder}
      >
        {isAscending ? "↓" : "↑"}
      </button>
    </div>
  );
}
