export default async function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 md:px-8 py-32">
      <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-8 text-[var(--foreground)]">
        Privacy Policy
      </h1>
      <div className="text-[var(--muted)] space-y-4 text-base leading-relaxed">
        <p>Last updated: 2026-05-25</p>
        <p>
          Baltic Landing collects only the contact information you voluntarily
          submit through our contact form (name, business description, contact
          details). This data is used solely to respond to your inquiry.
        </p>
        <p>
          We do not sell or share your data with third parties. We use Vercel
          for hosting and Resend for email delivery. Both providers are
          GDPR-compliant.
        </p>
        <p>
          For data deletion requests, contact:{" "}
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
