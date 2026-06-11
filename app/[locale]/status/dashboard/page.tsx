import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken, COOKIE_NAME } from "@/lib/status/token";
import { StatusDashboard } from "@/components/status/StatusDashboard";

export const metadata = { robots: "noindex,nofollow" };

export default async function StatusDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  const payload = raw ? await verifyToken(raw) : null;

  if (!payload) {
    redirect(`/${locale}/status`);
  }

  return <StatusDashboard locale={locale} />;
}
