"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const isActive = (href: string) => pathname === href;

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    // Check if user is logged in by checking for auth token
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
      setIsLoading(false);
    };

    checkAuth();

    // Cierra el menú cuando el usuario interacciona con la página
    const handleInteraction = (e: Event) => {
      // No cierra si el clic es en el botón de hamburguesa
      const target = e.target as HTMLElement;
      if (target.closest(`.${styles.hamburger}`)) {
        return;
      }
      closeSidebar();
    };

    // Escucha eventos de interacción
    document.addEventListener("click", handleInteraction);
    document.addEventListener("keydown", closeSidebar);
    document.addEventListener("scroll", closeSidebar);

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("keydown", closeSidebar);
      document.removeEventListener("scroll", closeSidebar);
    };
  }, []);

  // Evita que el clic en el botón de hamburguesa cierre el menú
  const handleHamburgerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSidebar();
  };

  // Evita que los clics en los enlaces del menú cierren inmediatamente
  const handleNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeSidebar();
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={handleHamburgerClick}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <aside
        className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}
        onClick={(e) => e.stopPropagation()}
      >
        <nav className={styles.nav} onClick={handleNavClick}>
          {isLoggedIn && (
            <>
              <Link
                href="/"
                className={`${styles.navLink} ${
                  isActive("/") ? styles.active : ""
                }`}
              >
                Home
              </Link>
              <Link
                href="/splitHouse"
                className={`${styles.navLink} ${
                  isActive("/splitHouse") ? styles.active : ""
                }`}
              >
                Casa rural
              </Link>
              <Link
                href="/colours"
                className={`${styles.navLink} ${
                  isActive("/colours") ? styles.active : ""
                }`}
              >
                Colores
              </Link>
            </>
          )}
          {isLoggedIn && (
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          )}
          {!isLoggedIn && !isLoading && (
            <div className={styles.notLoggedInMessage}>
              <p>Please log in to access the app</p>
              <Link href="/login" className={styles.loginLink}>
                Go to Login
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
