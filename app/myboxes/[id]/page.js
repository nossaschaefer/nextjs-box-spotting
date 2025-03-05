async function fetchBox(id) {
  const res = await fetch(`/api/boxes/${id}`);
  return res.json();
}

export default async function BoxDetails({ params }) {
  const box = await fetchBox(params.id);

  if (!box) return <p>Box not found</p>;

  return (
    <div>
      <h1 className="text-2xl">{box.boxName}</h1>
      <p>Items: {box.boxItems.join(", ")}</p>
      <p>Location: {box.boxLocation}</p>
    </div>
  );
}
