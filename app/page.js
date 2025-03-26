export default function Home() {
  return (
    <div className="p-4 px-10 pt-10 sm:px-32 md:px-56 lg:px-72">
      <h1 className="text-2xl text-center font-black lg:text-4xl">
        Welcome to
      </h1>
      <h1 className="text-2xl text-center font-black lg:text-4xl">
        Box Spotting
      </h1>

      <p className="text-sm text-center lg:text-base">
        An app to organize your storage boxes
      </p>
      <div className="leading-loose pt-8 lg:text-xl lg:leading-loose">
        <p>
          Add a box, give it a <span className="font-black">name</span> and fill
          it with <span className="font-black">items</span>. If you want you can
          also add a <span className="font-black">location</span> , a{" "}
          <span className="font-black">category</span>, a{" "}
          <span className="font-black">color</span> and upload a{" "}
          <span className="font-black">photo</span>.
        </p>
        <p>
          If something changes, you can always{" "}
          <span className="font-black">edit</span> your boxes. And if you are
          looking for something you can{" "}
          <span className="font-black">search</span> through them,{" "}
          <span className="font-black">filter</span> them and/or{" "}
          <span className="font-black">sort</span> them.
        </p>
      </div>
    </div>
  );
}
