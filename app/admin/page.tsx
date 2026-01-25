import Link from "next/link";
import { FileText, BookOpen, Layers, Plus } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Grammar Rules Card */}
                <Link
                    href="/admin/grammar-rules"
                    className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-semibold">Grammar Rules</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Create and manage grammar rules for feedback
                    </p>
                </Link>

                {/* Exercises Card */}
                <Link
                    href="/admin/exercises"
                    className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-semibold">Exercises</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Create exercises and link them to grammar rules
                    </p>
                </Link>

                {/* Curriculum Card */}
                <Link
                    href="/admin/curriculum"
                    className="p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-colors"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                            <Layers className="h-6 w-6 text-primary" />
                        </div>
                        <h2 className="font-semibold">Curriculum</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Manage units, lessons, and learning paths
                    </p>
                </Link>
            </div>
        </div>
    );
}
