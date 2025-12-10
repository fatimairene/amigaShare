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

    // Handler for back button presses
    const handlePopState = (event: PopStateEvent) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        // Redirect to login if user is not authenticated
        router.push("/login");
        window.history.forward();
      }
    };

    // Handler for preventing caching of protected pages
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from cache
        const token = localStorage.getItem("authToken");
        if (!token) {
          // Clear the page from cache
          window.history.replaceState(null, "", window.location.href);
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
