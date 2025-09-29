import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

import { getServerSession } from "next-auth";
import SessionProvider from "@/auth/createSession";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata: Metadata = {
  title: "Trio Hotel",
  description: "A hotel booking website",
};

export const jetBrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={jetBrainsMono.className}>
        <SessionProvider session={session}>
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
