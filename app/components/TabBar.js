import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function TabBar() {
  return (
    <nav className="flex justify-around fixed bottom-0 w-full pb-2 border-t-1 border-gray-200 text-violet-800 bg-white">
      <Link href="/myboxes" className="flex flex-col mt-2">
        <FontAwesomeIcon icon={faBox} />
        <p>my boxes</p>
      </Link>
      <Link href="/addbox" className="flex flex-col mt-2">
        <FontAwesomeIcon icon={faPlusCircle} />
        <p>add a box</p>
      </Link>
      <Link href="/search" className="flex flex-col mt-2">
        <FontAwesomeIcon icon={faSearch} size="1x" />
        <p>search</p>
      </Link>
    </nav>
  );
}
