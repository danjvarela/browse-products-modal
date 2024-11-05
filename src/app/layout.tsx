import type { Metadata } from "next";
import "./globals.css";
import { segoeUI } from "@/fonts";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Browse Products",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${segoeUI.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
