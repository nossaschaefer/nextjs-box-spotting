"use client";

import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DeleteBoxBtn({ onDelete }) {
  return (
    <button onClick={onDelete} className="mt-2 flex flex-row items-center ">
      <FontAwesomeIcon icon={faTrashCan} className="mr-2" />
      Delete
    </button>
  );
}
