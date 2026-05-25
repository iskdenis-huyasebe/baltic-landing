export default async function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 py-32">
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 text-[var(--foreground)]">
        Cookie Policy
      </h1>
      <div className="text-[var(--muted)] space-y-4 text-base leading-relaxed">
        <p>Last updated: 2026-05-25</p>
        <p>
          Baltic Landing uses minimal cookies. We use Vercel Analytics to
          measure site performance — this does not identify individual users
          and is GDPR-compliant.
        </p>
        <p>
          We do not use advertising cookies or third-party tracking pixels. No
          cookie consent banner is required for our current setup.
        </p>
        <p>
          For questions:{" "}
          <a
            href="mailto:denis@balticlanding.com"
            className="text-[var(--accent)] hover:underline"
          >
            denis@balticlanding.com
          </a>
        </p>
      </div>
    </main>
  );
}
