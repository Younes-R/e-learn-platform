import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import PrincipalBar from "@/ui/layout/principalBar";
import SearchBar from "@/ui/layout/searchBar";

export const metadata: Metadata = {
  title: "E-Learn Platform",
  description: "This is an E-Learn platform",
};

// const inter = Inter({
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PrincipalBar />
        <SearchBar />
        {children}
      </body>
    </html>
  );
}

// className={inter.className}
