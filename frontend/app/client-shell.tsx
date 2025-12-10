"use client";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ToastContainer from "./components/ToastContainer";
import { AuthProvider } from "./context/auth";
import { ToastProvider } from "./context/toast";
import { useEffect, useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ClientShell({ children }: Props) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        setIsDark(true);
        return;
      }
      if (saved === "light") {
        setIsDark(false);
        return;
      }
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    } catch {
      setIsDark(false);
    }
  }, []);

  useEffect(() => {
    // Keep in sync with Header's direct html.classList toggling
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  return (
    <AuthProvider>
      <ToastProvider>
        <div className={(isDark ? "dark " : "") + "flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors"}>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}



