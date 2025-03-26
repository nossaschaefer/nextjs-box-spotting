"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Welcome() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div className="flex flex-col items-center justify-center p-4 px-10 pt-10 sm:px-32 md:px-56 lg:px-72 ">
        <h2 className="text-2xl text-center font-black lg:text-4xl">
          Welcome {session.user.username}
        </h2>
        <p className="text-sm text-center lg:text-base">
          Organize your storage boxes
        </p>
        <div>
          <Image
            src="/logo_bw.png"
            width={400}
            height={400}
            alt="empty box"
            className="object-cover"
          />
        </div>
        <div className="leading-loose text-center lg:text-xl lg:leading-loose">
          <p>Add your first box.</p>
          <p>You can later edit it if you wish to.</p>
        </div>
      </div>
    );
  }
}
