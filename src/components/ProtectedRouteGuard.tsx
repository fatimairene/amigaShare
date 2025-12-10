"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ProtectedRouteGuard() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via API (uses httpOnly cookie)
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();

        if (!data.isAuthenticated) {
          // Redirect to login if not authenticated
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    checkAuth();

    // Handler for back button presses
    const handlePopState = async (event: PopStateEvent) => {
      try {
        const response = await fetch("/api/auth/check");
        const data = await response.json();
        if (!data.isAuthenticated) {
          // Redirect to login if user is not authenticated
          router.push("/login");
          window.history.forward();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      }
    };

    // Handler for preventing caching of protected pages
    const handlePageShow = async (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from cache
        try {
          const response = await fetch("/api/auth/check");
          const data = await response.json();
          if (!data.isAuthenticated) {
            // Clear the page from cache
            window.history.replaceState(null, "", window.location.href);
            router.push("/login");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          router.push("/login");
        }
      }
    };

    // Listen for back button presses
    window.addEventListener("popstate", handlePopState);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      // Properly remove the same event listener references that were added
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
