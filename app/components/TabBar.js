import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
// import { faQrcode } from "@fortawesome/free-solid-svg-icons";
// import { faHouse } from "@fortawesome/free-solid-svg-icons";

export default function TabBar() {
  return (
    <nav className="flex justify-around fixed bottom-0 w-full pb-2 border-t-1 border-gray-200 text-violet-800 bg-white">
      <a href="/myboxes">
        <FontAwesomeIcon icon={faBox} />
        <p>my boxes</p>
      </a>
      <a href="/addbox">
        <FontAwesomeIcon icon={faPlusCircle} />
        <p>add a box</p>
      </a>
      <a href="/search">
        <FontAwesomeIcon icon={faSearch} size="1x" />
        <p>search</p>
      </a>
    </nav>
  );
}
