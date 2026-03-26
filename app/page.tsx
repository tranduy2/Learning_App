"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function HomePage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="min-h-screen bg-white dark:bg-[#111318]">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">💎</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Lingua</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#method" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Method</a>
          <a href="#pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="p-2 rounded-lg bg-gray-100 dark:bg-[#1B1D24] hover:bg-gray-200 dark:hover:bg-[#2A2D35] transition-colors"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          )}
          <Link href="/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Login</Link>
          <Link href="/signup" className="px-5 py-2 bg-[#3C83F6] text-white rounded-full text-sm font-semibold hover:bg-[#2B6FE0] transition-colors">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              <span className="text-gray-900 dark:text-white">Stop Guessing.</span>
              <br />
              <span className="text-[#3C83F6] dark:text-[#6BA3F7] italic">Start Understanding.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Lingua uses a unique rule-based feedback system to teach you the <strong className="text-gray-900 dark:text-white">why</strong> behind English grammar, not just the <em>what</em>.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup" className="px-7 py-3 bg-[#3C83F6] text-white font-semibold rounded-lg hover:bg-[#2B6FE0] transition-colors shadow-lg shadow-[#3C83F6]/20">
                Get Started for Free
              </Link>
              <a href="#method" className="px-7 py-3 border border-[#D4D6DB] dark:border-[#2E3039] rounded-lg hover:bg-gray-100 dark:hover:bg-[#1B1D24] flex items-center gap-2 text-[#1A1C1E] dark:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg>
                See how it works
              </a>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-green-400 border-2 border-white dark:border-[#111318]"></div>
                <div className="w-8 h-8 rounded-full bg-[#3C83F6] border-2 border-white dark:border-[#111318]"></div>
                <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white dark:border-[#111318]"></div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Trusted by <strong className="text-gray-900 dark:text-white">10,000+</strong> learners</span>
            </div>
          </div>

          {/* Demo Card */}
          <div className="bg-white dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039]/50 rounded-2xl p-6 shadow-xl dark:shadow-2xl dark:shadow-[#3C83F6]/5">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-transparent dark:border-red-900/20 rounded-lg">
                <span className="text-red-500 mt-0.5">✗</span>
                <span className="text-gray-900 dark:text-gray-200">
                  <span className="line-through text-red-400">She go</span> She <span className="text-green-400 font-semibold">goes</span> to the store.
                </span>
              </div>
              <div className="p-4 bg-[#3C83F6]/5 dark:bg-[#3C83F6]/10 border border-[#3C83F6]/20 dark:border-[#3C83F6]/20 rounded-lg">
                <p className="text-xs text-[#3C83F6] dark:text-[#6BA3F7] font-bold mb-1 tracking-wider">LOGIC RULE #42</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Third-person singular subjects require verbs ending in &quot;s&quot; in the present simple tense.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="method" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-bold text-[#3C83F6] mb-2 tracking-widest uppercase">The Methodology</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Why Rule-Based Learning Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Logic-Driven Feedback</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Traditional apps tell you <em>that</em> you&apos;re wrong. Lingua explains <strong className="text-gray-900 dark:text-white">why</strong>. Our engine analyzes the structure of your sentence and provides a detailed breakdown of the grammatical rule you missed.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#3C83F6]/10 dark:bg-[#3C83F6]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3C83F6] text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Instant Corrections</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get feedback the moment you finish typing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D06A00]/10 dark:bg-[#D06A00]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#D06A00] text-sm">🧠</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Deep Understanding</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Internalize the rules so you never make the same mistake twice.</p>
                  </div>
                </div>
              </div>
              <a href="#" className="inline-flex items-center gap-1 px-5 py-2 border border-[#3C83F6] text-[#3C83F6] rounded-full text-sm font-medium hover:bg-[#3C83F6]/5 dark:hover:bg-[#3C83F6]/10 transition-colors">
                Learn more about our method
              </a>
            </div>

            {/* Right Columns - Feature Cards */}
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039]/50">
                <div className="w-10 h-10 rounded-xl bg-[#3C83F6]/10 dark:bg-[#3C83F6]/20 flex items-center justify-center text-[#3C83F6] mb-4 text-lg">⚡</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Real-time Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Instant feedback as you type complex sentences, powered by our custom syntax engine.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039]/50">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-500 mb-4 text-lg">🌳</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Grammar Logic Trees</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Visualize how sentence structures connect. See the skeleton of the language.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039]/50">
                <div className="w-10 h-10 rounded-xl bg-[#D06A00]/10 dark:bg-[#D06A00]/20 flex items-center justify-center text-[#D06A00] mb-4 text-lg">📈</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Visual Progress</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Watch your mastery grow across 12 distinct grammar categories with clear charts.</p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#1B1D24] border border-[#D4D6DB] dark:border-[#2E3039]/50">
                <div className="w-10 h-10 rounded-xl bg-[#6277A4]/10 dark:bg-[#6277A4]/20 flex items-center justify-center text-[#6277A4] mb-4 text-lg">👥</div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Expert Curated</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">Exercises designed by linguists to target common pain points for learners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-[#151720]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-14">Simple 3-Step Process</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-[#3C83F6] text-[#3C83F6] flex items-center justify-center text-xl font-bold mb-4">1</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Write</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Practice with daily prompts or free-write your own thoughts.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-[#3C83F6] text-[#3C83F6] flex items-center justify-center text-xl font-bold mb-4">2</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Analyze</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Our engine breaks down your sentence structure instantly.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full border-2 border-[#3C83F6] text-[#3C83F6] flex items-center justify-center text-xl font-bold mb-4">3</div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Master</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review the logic rules and track your improvement over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#3C83F6] to-[#2B6FE0] dark:from-[#3C83F6]/90 dark:to-[#111318]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Ready to master English<br />grammar?
          </h2>
          <p className="text-blue-100 dark:text-blue-200 mb-8 leading-relaxed">
            Join thousands of learners using the logic-based approach today. No credit card required.
          </p>
          <Link href="/signup" className="inline-flex px-8 py-3 bg-white text-[#3C83F6] font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg">
            Get Started for Free
          </Link>
          <p className="text-blue-200 dark:text-blue-300 text-sm mt-4">Free 14-day trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#D4D6DB] dark:border-[#2E3039] bg-white dark:bg-[#111318]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-xs">💎</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">Lingua</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Instagram</a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">© 2026 Lingua Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
