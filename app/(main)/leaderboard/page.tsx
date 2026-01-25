import { Trophy, Medal, Award, User } from "lucide-react";

// Mock data - will replace with Supabase later
const mockLeaderboard = [
    { id: "1", name: "Sarah Chen", xp: 2450, level: "B1" },
    { id: "2", name: "John Smith", xp: 2180, level: "A2" },
    { id: "3", name: "Maria Garcia", xp: 1950, level: "A2" },
    { id: "4", name: "David Kim", xp: 1720, level: "A2" },
    { id: "5", name: "Emma Wilson", xp: 1580, level: "A1" },
    { id: "6", name: "Alex Johnson", xp: 1340, level: "A1" },
    { id: "7", name: "Lisa Brown", xp: 1120, level: "A1" },
    { id: "8", name: "Tom Davis", xp: 890, level: "A1" },
    { id: "9", name: "Amy Lee", xp: 650, level: "A1" },
    { id: "10", name: "You", xp: 250, level: "A1" },
];

export default function LeaderboardPage() {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-8 w-8 text-accent" />
                <h1 className="text-2xl font-bold">Leaderboard</h1>
            </div>

            <div className="space-y-2">
                {mockLeaderboard.map((user, index) => (
                    <div
                        key={user.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${index < 3
                                ? "bg-accent/5 border-accent/20"
                                : user.name === "You"
                                    ? "bg-primary/5 border-primary/20"
                                    : "bg-card border-border"
                            }`}
                    >
                        {/* Rank */}
                        <div className="w-10 text-center">
                            {index === 0 ? (
                                <Trophy className="h-6 w-6 text-yellow-500 mx-auto" />
                            ) : index === 1 ? (
                                <Medal className="h-6 w-6 text-gray-400 mx-auto" />
                            ) : index === 2 ? (
                                <Award className="h-6 w-6 text-orange-400 mx-auto" />
                            ) : (
                                <span className="font-bold text-muted-foreground">{index + 1}</span>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.name === "You" ? "bg-primary text-primary-foreground" : "bg-primary/10"
                            }`}>
                            <User className={`h-5 w-5 ${user.name === "You" ? "" : "text-primary"}`} />
                        </div>

                        {/* Name */}
                        <div className="flex-1">
                            <p className={`font-medium ${user.name === "You" ? "text-primary" : ""}`}>
                                {user.name}
                            </p>
                            <p className="text-sm text-muted-foreground">Level {user.level}</p>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                            <p className="font-bold text-primary">{user.xp.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">XP</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
