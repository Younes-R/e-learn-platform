import styles from "./layout.module.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import PrincipalBar from "@/ui/layout/principalBar";
import SearchBar from "@/ui/layout/searchBar";

// export const metadata: Metadata = {
//   title: "E-Learn Platform",
//   description: "This is an E-Learn platform",
// };

// const inter = Inter({
//   subsets: ["latin"],
// });

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layout}>
      <PrincipalBar />
      <SearchBar />
      {children}
    </div>
  );
}

// className={inter.className}
