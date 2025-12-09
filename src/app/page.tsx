"use client";

import { useState } from "react";
import UsersList from "@/components/UsersList";

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <UsersList key={refreshKey} onUserAdded={handleUserAdded} />
    </div>
  );
}
