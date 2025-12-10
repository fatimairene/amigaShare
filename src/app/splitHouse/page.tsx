"use client";

import ExpenseSplitter from "@/components/ExpenseSplitter";
import { ProtectedRouteGuard } from "@/components/ProtectedRouteGuard";

export default function SplitHousePage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <ProtectedRouteGuard />
      <ExpenseSplitter />
    </div>
  );
}
