"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatAssistant from "@/components/layout/ChatAssistant";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
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
  );
}
