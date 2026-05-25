import { Check } from "lucide-react";

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex items-center justify-center mx-auto mb-6">
          <Check className="size-8 text-[var(--accent)]" />
        </div>
        <h1 className="text-3xl font-medium text-[var(--foreground)] mb-4">
          Payment successful!
        </h1>
        <p className="text-[var(--muted)] mb-8">
          Thank you! I&apos;ll reach out within 1 hour to schedule the kickoff call.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--accent-foreground)] rounded-xl px-6 py-3 text-base font-medium hover:opacity-90 transition-opacity"
        >
          Back to home
        </a>
      </div>
    </main>
  );
}
