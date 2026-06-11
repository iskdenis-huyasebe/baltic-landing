import { Suspense } from "react";
import type { Metadata } from "next";
import { StatusLoginClient } from "@/components/status/StatusLoginClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function StatusLoginPage() {
  return (
    <Suspense fallback={null}>
      <StatusLoginClient />
    </Suspense>
  );
}
