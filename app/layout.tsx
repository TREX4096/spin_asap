"use client"; // Make this a client component

import localFont from "next/font/local";
import "./globals.css";

import {AppModeContextProvider} from "../context/appMode"
import {AdminContextProvider} from "../context/adminContext"
import { SessionProvider } from "next-auth/react";
import { TbLayoutNavbar } from "react-icons/tb";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider>
          <AdminContextProvider>
        <AppModeContextProvider>
          {children}
           </AppModeContextProvider>
        </AdminContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
