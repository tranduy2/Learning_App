import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col bg-[#F0F2F5] dark:bg-[#0B1525]">
            {children}

            {/* Footer */}
            <footer className="py-6 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <span className="text-lg font-bold text-[#1A1C1E] dark:text-white">Lingua</span>
                    <div className="flex items-center gap-6 text-sm text-[#75777F]">
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Help</a>
                        <a href="#" className="hover:text-[#1A1C1E] dark:hover:text-white transition-colors">Languages</a>
                    </div>
                    <p className="text-sm text-[#75777F]">© 2024 Lingua Learning Inc.</p>
                </div>
            </footer>
        </div>
    );
}
