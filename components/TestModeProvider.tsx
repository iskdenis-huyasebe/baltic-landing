"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function TestModeDetector() {
  const params = useSearchParams();

  useEffect(() => {
    if (params.get("test") === "1") {
      try { sessionStorage.setItem("test_mode", "1"); } catch {}
    }
  }, [params]);

  return null;
}

export function TestModeProvider() {
  return (
    <Suspense fallback={null}>
      <TestModeDetector />
    </Suspense>
  );
}
