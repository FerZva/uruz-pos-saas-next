import type { Metadata } from "next";
import "./globals.css";
import TanStackProvider from "./components/providers/TanStackProvider";
export const metadata: Metadata = {
  title: "URUZ POS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="antialiased">
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}
