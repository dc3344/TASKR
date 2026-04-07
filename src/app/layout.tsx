import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TASKR — Operational Task Board",
  description: "Shared operational task board for high-tempo environments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
