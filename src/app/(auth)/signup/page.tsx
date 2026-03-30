"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordStrength = useMemo(() => {
        if (!password) return 0;
        let score = 0;
        if (password.length >= 6) score++;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        return Math.min(score, 4);
    }, [password]);

    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong Password"][passwordStrength] || "";
    const strengthColor = ["", "#EF4444", "#F59E0B", "#3C83F6", "#16A34A"][passwordStrength] || "";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: name } },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/learn");
        }
    }

    async function handleGoogleSignUp() {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/auth/callback?next=/learn` },
        });
    }

    return (
        <>
            {/* Nav */}
            <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
                <Link href="/" className="text-xl font-bold text-[#3C83F6]">Lingua</Link>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-[#75777F] hidden sm:inline">Already have an account?</span>
                    <Link href="/login" className="text-sm text-[#3C83F6] font-semibold hover:underline">Login</Link>
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-8 shadow-sm">
                        <h1 className="text-2xl font-bold text-center text-[#1A1C1E] dark:text-white mb-2 italic">Start Learning Today</h1>
                        <p className="text-center text-[#75777F] text-sm mb-8">
                            Join the world&apos;s most accessible language platform.
                        </p>

                        {/* Google */}
                        <button
                            onClick={handleGoogleSignUp}
                            className="w-full flex items-center justify-center gap-3 py-3 border border-[#D4D6DB] dark:border-[#2A3A52] rounded-full hover:bg-gray-50 dark:hover:bg-[#162236] transition-colors mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            <span className="font-medium text-[#1A1C1E] dark:text-white text-sm">Continue with Google</span>
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-[#D4D6DB] dark:bg-[#2A3A52]"></div>
                            <span className="text-xs text-[#75777F] uppercase tracking-widest font-medium">Or Use Email</span>
                            <div className="flex-1 h-px bg-[#D4D6DB] dark:bg-[#2A3A52]"></div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1C1E] dark:text-white mb-2">Full Name</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75777F]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Jane Doe"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2A3A52] text-[#1A1C1E] dark:text-white placeholder-[#9CA0A8] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1C1E] dark:text-white mb-2">Email Address</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75777F]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="jane@example.com"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2A3A52] text-[#1A1C1E] dark:text-white placeholder-[#9CA0A8] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1C1E] dark:text-white mb-2">Password</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#75777F]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2A3A52] text-[#1A1C1E] dark:text-white placeholder-[#9CA0A8] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] focus:border-transparent text-sm"
                                    />
                                </div>

                                {/* Password strength bar */}
                                {password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className="flex-1 h-1.5 rounded-full"
                                                    style={{
                                                        backgroundColor: passwordStrength >= level ? strengthColor : "#D4D6DB",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider mt-1.5" style={{ color: strengthColor }}>
                                            {strengthLabel}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#3C83F6] hover:bg-[#2B6FE0] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#3C83F6]/25"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                            </button>
                        </form>

                        <p className="text-center text-xs text-[#75777F] mt-6 leading-relaxed">
                            By signing up, you agree to our{" "}
                            <a href="#" className="text-[#3C83F6] font-semibold hover:underline">Terms of Service</a>{" "}
                            and{" "}
                            <a href="#" className="text-[#3C83F6] font-semibold hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}
