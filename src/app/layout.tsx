import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "E-Learn Platform",
  description: "This is an E-Learn platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
