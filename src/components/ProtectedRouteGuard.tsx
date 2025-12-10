"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedRouteGuard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem("authToken");

    if (!isLoggedIn) {
      // Redirect to login if not authenticated
      router.push("/login");
    }

    // Prevent browser back button from accessing protected pages
    const handlePopState = (event: PopStateEvent) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Redirect to login if user is not authenticated
        router.push("/login");
        window.history.forward();
      }
    };

    // Listen for back button presses
    window.addEventListener("popstate", handlePopState);

    // Prevent caching of protected pages
    const preventCaching = () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Clear the page from cache
        window.history.replaceState(null, "", window.location.href);
        router.push("/login");
      }
    };

    window.addEventListener("pageshow", (event) => {
      if (event.persisted) {
        // Page was restored from cache
        preventCaching();
      }
    });

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", preventCaching as EventListener);
    };
  }, [router]);

  return null;
}
