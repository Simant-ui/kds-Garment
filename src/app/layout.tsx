"use client";

import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatAssistant from "@/components/layout/ChatAssistant";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="antialiased font-sans">
        <ThemeProvider>
          <CartProvider>
            {!isAdminPage && <Navbar />}
            <main className={!isAdminPage ? "min-h-screen" : ""}>
              {children}
            </main>
            {!isAdminPage && <Footer />}
            {!isAdminPage && <ChatAssistant />}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
