"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TabBar() {
  const pathname = usePathname();

  return (
    <nav className="flex justify-around fixed bottom-0 w-full pb-2 shadow-[0_-2px_4px_rgba(0,0,0,0.1)] text-sm bg-rose-300">
      <Link
        href="/myboxes"
        className={`flex flex-col mt-2 ${
          pathname === "/myboxes" ? "text-black" : "text-slate-50"
        } `}
      >
        <FontAwesomeIcon icon={faBox} />
        <p>my boxes</p>
      </Link>
      <Link
        href="/addbox"
        className={`flex flex-col mt-2 ${
          pathname === "/addbox" ? "text-black" : "text-slate-50"
        } `}
      >
        <FontAwesomeIcon icon={faPlusCircle} />
        <p>add a box</p>
      </Link>
      <Link
        href="/search"
        className={`flex flex-col mt-2 ${
          pathname === "/search" ? "text-black" : "text-slate-50"
        } `}
      >
        <FontAwesomeIcon icon={faSearch} size="1x" />
        <p>search</p>
      </Link>
    </nav>
  );
}
