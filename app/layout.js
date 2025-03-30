"use client";

import "./globals.css";
import TabBar from "./components/TabBar";
import { SessionProvider, useSession } from "next-auth/react";
import AuthLink from "./components/AuthLink";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montse = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

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
    <html lang="en" className="bg-slate-100">
      <head>
        <link rel="icon" href="/icon.ico" sizes="any" priority={false} />
      </head>
      <body className={`bg-gray-100 ${montse.className}`}>
        <header className=" bg-blue-200 text-black text-center flex flex-row justify-between items-center sticky top-0 z-50 shadow-md">
          {/* Change link based on login state */}
          <Link href={session ? "/welcome" : "/"}>
            <div className="flex flex-row items-center">
              <Image
                src="/logo_c.png"
                alt="logo"
                width={70}
                height={70}
                className="ml-4"
              />
              <h1 className="font-semibold ml-1">Box Spotting</h1>
            </div>
          </Link>
          <AuthLink />
        </header>
        <main className="px-4 bg-slate-100">{children}</main>
        {session && <TabBar />}
      </body>
    </html>
  );
}
