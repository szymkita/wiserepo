import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppLayout } from "@/components/layout/app-layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WiseGroup — System Zarządzania",
  description:
    "Cross-company visibility klientów, projektów i usług między spółkami grupy WiseGroup.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <AppLayout>{children}</AppLayout>
        <Script id="userback" strategy="afterInteractive">
          {`
            window.Userback = window.Userback || {};
            Userback.access_token = "A-5wpCkPv7qLxkVSEDCr90qTkvr";
          `}
        </Script>
        <Script
          src="https://static.userback.io/widget/v1.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
