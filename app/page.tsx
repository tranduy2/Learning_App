import Link from "next/link";
import { GraduationCap, BookOpen, Trophy, Zap, Target, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-foreground">Lingua</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-foreground hover:text-primary">
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
            Learn English the <span className="text-primary">Smart Way</span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            Master English with our rule-based learning system. Get instant feedback,
            track your progress, and achieve fluency with CEFR-aligned lessons.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90"
            >
              Start Learning Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-muted"
            >
              I have an account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-card">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Lingua?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<BookOpen className="h-8 w-8" />}
              title="CEFR Curriculum"
              description="Structured lessons from A1 to C2 level"
            />
            <FeatureCard
              icon={<Target className="h-8 w-8" />}
              title="Smart Feedback"
              description="Get explanations when you make mistakes"
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Gamification"
              description="Earn XP and maintain streaks"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8" />}
              title="Track Progress"
              description="Visualize your learning journey"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">Lingua</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 University of Greenwich Final Year Project
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-background border border-border">
      <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
