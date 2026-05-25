export default async function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 py-32">
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 text-[var(--foreground)]">
        Terms of Service
      </h1>
      <div className="text-[var(--muted)] space-y-4 text-base leading-relaxed">
        <p>Last updated: 2026-05-25</p>
        <p>
          By using Baltic Landing services, you agree to these terms. We
          provide landing page design and development services as described in
          the pricing section. Payment is required before work begins.
        </p>
        <p>
          The Setup fee (€200) is a one-time payment. Monthly subscriptions
          (Care €15/mo, Growth €30/mo) begin from the 2nd month and can be
          cancelled at any time. The website remains yours upon cancellation.
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
