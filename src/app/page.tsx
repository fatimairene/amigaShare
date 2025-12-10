"use client";

import { useState } from "react";
import UsersList from "@/components/UsersList";
import { ProtectedRouteGuard } from "@/components/ProtectedRouteGuard";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <ProtectedRouteGuard />
      <UsersList key={refreshKey} onUserAdded={handleUserAdded} />
    </div>
  );
}
