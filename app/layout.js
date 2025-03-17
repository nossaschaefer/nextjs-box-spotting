"use client";

import "./globals.css";
import TabBar from "./components/TabBar";
import { SessionProvider } from "next-auth/react";
import AuthLink from "./components/AuthLink";
import Image from "next/image";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/icon.ico" sizes="any" priority={false} />
        </head>
        <body className="bg-gray-100 text-gray-900">
          <header className=" bg-violet-800 text-white text-center flex flex-row justify-between items-center">
            <div className="flex flex-row items-center">
              <Image
                src="/logo_c.png"
                alt="logo"
                width={70}
                height={70}
                className=""
              />
              <h1 className="">Box Spotting</h1>
            </div>
            <AuthLink />
          </header>
          <main className="px-4">{children}</main>
          <TabBar />
        </body>
      </html>
    </SessionProvider>
  );
}
