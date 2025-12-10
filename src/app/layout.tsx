import type { Metadata } from "next";
import Sidebar from "@/components/Sidebar";
import SessionProvider from "@/components/SessionProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "AmigaShare - Split Expenses by Days",
  description:
    "Split expenses among friends based on the number of days each person is staying",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SessionProvider>
          <Sidebar />
          <main>{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}
