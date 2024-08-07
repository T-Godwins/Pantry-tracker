import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import SessionProvider from "./SessionProvider";
import { NextAuth } from "../pages/api/auth/[...nextauth]";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
const session = await getServerSession(NextAuth);

  return (
      <html lang="en">
        <SessionProvider session={session}>
        <body className={inter.className}>{children}</body>
        </SessionProvider>
      </html>
      
  );
}
