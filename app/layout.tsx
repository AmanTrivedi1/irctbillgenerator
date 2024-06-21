import type { Metadata } from "next";
import toast, { Toaster } from 'react-hot-toast';
import {  Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ subsets: ["latin"] , weight:["300" , "400" , "500" , "600"] });

export const metadata: Metadata = {
  title: "IRCTC",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
