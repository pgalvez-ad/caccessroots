import Link from "next/link";
import { Wordmark } from "@/components/wordmark";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-oat-50">
      <header className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Wordmark size="md" showSub />
        <nav className="flex items-center gap-3">
          <Link href="/sign-in" className="btn-secondary">Sign in</Link>
          <Link href="/sign-up" className="btn-primary">Get started</Link>
        </nav>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="badge bg-brand-50 text-brand-800 mb-4">
              Sponsored by Applied Development
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-medium text-forest-700 leading-[1.05] tracking-tight">
              Where access
              <br />
              takes <em className="not-italic text-brand-600">root.</em>
            </h1>
            <p className="mt-6 text-lg text-olive-700 max-w-lg leading-relaxed">
              A simple, warm place for Deaf community members to request
              interpreters for the moments that matter, and for volunteer
              interpreters to give back close to home. We're not here for money.
              We're here to provide access in spaces that laws and contracts
              don't reach.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/sign-up" className="btn-primary">
                Request an interpreter
              </Link>
              <Link href="/sign-up?role=interpreter" className="btn-secondary">
                Volunteer as an interpreter
              </Link>
            </div>
            <p className="mt-6 text-sm italic text-brand-700">
              Communication. Access. Roots.
            </p>
          </div>

          <div className="card p-6">
            <h3 className="font-serif text-2xl text-forest-700 mb-4">
              Why CAccessRoots
            </h3>
            <ul className="space-y-4 text-sm">
              <Feature
                title="Local geo intelligence"
                desc="Distance, travel time, and service radius. Interpreters see the work that's actually a fit for where they live."
              />
              <Feature
                title="Your conflicts, respected"
                desc="Requestors list people they shouldn't be paired with. Those interpreters never see the request. Period."
              />
              <Feature
                title="Admin oversight"
                desc="Sensitive assignments (medical, family, funerals) route through admin approval before anyone is matched."
              />
              <Feature
                title="Built for community"
                desc="Partner Deaf community organizations can vouch for members and see their community's activity."
              />
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-brand-50 py-16 border-y border-brand-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-forest-700">
            For the moments that matter.
          </h2>
          <p className="mt-4 text-olive-700 leading-relaxed max-w-2xl mx-auto">
            Funerals. Weddings. Parent–teacher nights. A grandparent's birthday
            dinner. The conversations where being understood isn't a luxury,
            it's a quiet kind of belonging. CAccessRoots is built to honor
            those moments.
          </p>
        </div>
      </section>

      <footer className="py-10 text-center text-sm text-olive-600">
        <Wordmark size="sm" href={null} />
        <p className="mt-2 italic">
          A pro bono initiative of Applied Development. Not a paid service.
        </p>
      </footer>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <li>
      <div className="flex gap-3">
        <div className="mt-1.5 h-2 w-2 rounded-full bg-brand-600 shrink-0" />
        <div>
          <p className="font-medium text-forest-700">{title}</p>
          <p className="text-olive-700">{desc}</p>
        </div>
      </div>
    </li>
  );
}
