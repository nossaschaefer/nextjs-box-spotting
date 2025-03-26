"use client";

import "./globals.css";
import TabBar from "./components/TabBar";
import { SessionProvider, useSession } from "next-auth/react";
import AuthLink from "./components/AuthLink";
import Image from "next/image";
import Link from "next/link";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SessionProvider>
  );
}

function LayoutContent({ children }) {
  const { data: session } = useSession();

  return (
    <html lang="en" className="bg-sky-900">
      <head>
        <link rel="icon" href="/icon.ico" sizes="any" priority={false} />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <header className=" bg-lime-100 text-black text-center flex flex-row justify-between items-center sticky top-0 z-50">
          {/* Change link based on login state */}
          <Link href={session ? "/welcome" : "/"}>
            <div className="flex flex-row items-center">
              <Image
                src="/logo_bw.svg"
                alt="logo"
                width={70}
                height={70}
                className=""
              />
              <h1 className="font-semibold">Box Spotting</h1>
            </div>
          </Link>
          <AuthLink />
        </header>
        <main className="px-4 bg-sky-900">{children}</main>
        {session && <TabBar />}
      </body>
    </html>
  );
}
