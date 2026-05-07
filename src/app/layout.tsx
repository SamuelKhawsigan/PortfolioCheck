import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/Toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio CMS | Premium Digital Presence",
  description: "A high-end, dynamic portfolio and CMS for modern developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        {/* ToastProvider wraps everything so any page can use useToast() */}
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
