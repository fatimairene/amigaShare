"use client";

import { useSearchParams } from "next/navigation";

export function LoginSearchParams() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  if (!message) return null;

  return <div className="success">{message}</div>;
}
