"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({ email, password });

            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.refresh();
                router.push("/learn");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    }

    async function handleGoogleLogin() {
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
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm text-[#75777F] hover:text-[#1A1C1E] dark:hover:text-white">Login</Link>
                    <Link href="/signup" className="px-5 py-2 bg-[#3C83F6] text-white rounded-full text-sm font-semibold hover:bg-[#2B6FE0] transition-colors">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Main */}
            <main className="flex-1 flex items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    {/* Card */}
                    <div className="bg-white dark:bg-[#111C2E] border border-[#D4D6DB] dark:border-[#1E3050] rounded-2xl p-8 shadow-sm">
                        <h1 className="text-2xl font-bold text-center text-[#1A1C1E] dark:text-white mb-2">Welcome Back</h1>
                        <p className="text-center text-[#75777F] text-sm mb-8">Continue your language journey today.</p>

                        {/* Google */}
                        <button
                            onClick={handleGoogleLogin}
                            suppressHydrationWarning
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
                            <span className="text-xs text-[#75777F] uppercase tracking-widest font-medium">Or Email</span>
                            <div className="flex-1 h-px bg-[#D4D6DB] dark:bg-[#2A3A52]"></div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#1A1C1E] dark:text-white mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2A3A52] text-[#1A1C1E] dark:text-white placeholder-[#9CA0A8] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-semibold text-[#1A1C1E] dark:text-white">Password</label>
                                    <a href="#" className="text-sm text-[#3C83F6] hover:underline font-medium">Forgot password?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-[#F0F2F5] dark:bg-[#0B1525] border border-[#D4D6DB] dark:border-[#2A3A52] text-[#1A1C1E] dark:text-white placeholder-[#9CA0A8] focus:outline-none focus:ring-2 focus:ring-[#3C83F6] focus:border-transparent text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#75777F] hover:text-[#1A1C1E] dark:hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-[#3C83F6] hover:bg-[#2B6FE0] text-white font-semibold rounded-full transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#3C83F6]/25"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login to Lingua"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-[#75777F] mt-6">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-[#3C83F6] font-semibold hover:underline">Sign up</Link>
                        </p>
                    </div>

                    {/* Below card links */}
                    <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#75777F]">
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Help Center</a>
                    </div>
                </div>
            </main>
        </>
    );
}
