export default function Search() {
  return (
    <form className="p-4 mt-32 flex flex-col text-left px-16">
      <label htmlFor="">Search</label>
      <input
        type="text"
        className="border-2  border-blue-500 rounded placeholder:text-gray-400 mt-2"
      />
    </form>
  );
}
