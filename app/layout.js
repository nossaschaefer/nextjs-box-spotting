"use client";

import "./globals.css";
import TabBar from "./components/TabBar";
import { SessionProvider } from "next-auth/react";

export default function Layout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          <header className="p-4 bg-violet-800 text-white text-center">
            <h1>Box Spotting</h1>
          </header>
          <main className="p-4">{children}</main>
          <TabBar />
        </body>
      </html>
    </SessionProvider>
  );
}
