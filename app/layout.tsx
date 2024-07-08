import type { Metadata } from "next";
import { Toaster } from 'sonner';
import {  Poppins } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/sidebar";

const poppins = Poppins({ subsets: ["latin"] , weight:["300" , "400" , "500" , "600"] });

export const metadata: Metadata = {
  title: "The Chef's Touch",
  description: "One place bill",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
         <div className="flex sm:flex-row flex-col">
            <Sidebar />
            <main className="flex-grow p-4">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
