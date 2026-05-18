"use client";
import { useState } from "react";
import { handleSignOut } from "@/lib/actions";
import PushNotificationSender from "@/components/PushNotificationSender";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line, Legend,
} from "recharts";

type Answer = { questionId: number; selectedAnswer: string; isCorrect: boolean; confidenceScore: number };
type TestResult = { id: string; score: number; level: string; completedAt: Date; answers: Answer[] } | null;
type Interaction = { id: string; userInput: string; aiOutput: string; createdAt: Date };
type User = {
  id: string; name: string | null; email: string; level: string | null;
  createdAt: Date; preTest: TestResult; postTest: TestResult; interactions: Interaction[];
};
type Stats = {
  totalUsers: number; usersWithPreTest: number; usersWithPostTest: number; usersCompleted: number;
  avgImprovement: number; avgPreScore: number; avgPostScore: number;
  levelDistribution: { BEGINNER: number; INTERMEDIATE: number; ADVANCED: number; NONE: number };
  totalInteractions: number; avgConfidenceAll: number;
};

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: "bg-amber-100 text-amber-700 border-amber-300",
  INTERMEDIATE: "bg-blue-100 text-blue-700 border-blue-300",
  ADVANCED: "bg-emerald-100 text-emerald-700 border-emerald-300",
};

function StatusBadge({ user }: { user: User }) {
  if (!user.preTest) return <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-500 font-medium border border-slate-200">Belum Pre-Test</span>;
  if (user.interactions.length < 5) return <span className="px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-600 font-medium border border-orange-200">Proses AI ({user.interactions.length}/5)</span>;
  if (!user.postTest) return <span className="px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-600 font-medium border border-purple-200">Siap Post-Test</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-100 text-emerald-600 font-medium border border-emerald-200">✓ Selesai</span>;
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className={`rounded-2xl border p-4 md:p-5 flex flex-col justify-between ${color}`}>
      <p className="text-[10px] md:text-xs font-bold uppercase tracking-wider opacity-70 mb-1">{label}</p>
      <p className="text-2xl md:text-3xl font-black">{value}</p>
      {sub && <p className="text-[10px] md:text-xs mt-1 opacity-60 font-medium">{sub}</p>}
    </div>
  );
}

function UserDetailPanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [tab, setTab] = useState<"test" | "ai">("test");
  const [expandedChat, setExpandedChat] = useState<string | null>(null);
  const improvement = user.preTest && user.postTest ? user.postTest.score - user.preTest.score : null;
  const avgConf = (answers: Answer[]) => answers.length ? (answers.reduce((s, a) => s + a.confidenceScore, 0) / answers.length).toFixed(1) : "–";

  const radarData = user.preTest?.answers.map((a, i) => ({
    soal: `S${a.questionId}`,
    "Pre-Conf": a.confidenceScore,
    "Post-Conf": user.postTest?.answers[i]?.confidenceScore ?? 0,
  })) ?? [];

  const downloadJSON = () => {
    const dataStr = JSON.stringify(user.interactions, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `riwayat-ai-${user.name?.replace(/\\s+/g, '-').toLowerCase() || 'user'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    const headers = ["Soal", "Jawaban Pre-Test", "Benar/Salah Pre-Test", "Conf Pre-Test", "Jawaban Post-Test", "Benar/Salah Post-Test", "Conf Post-Test"];
    const rows = [];
    
    const totalQuestions = user.preTest ? user.preTest.answers.length : (user.postTest ? user.postTest.answers.length : 0);
    
    for (let i = 0; i < totalQuestions; i++) {
      const pre = user.preTest?.answers[i];
      const post = user.postTest?.answers[i];
      
      rows.push([
        `Soal ${i + 1}`,
        pre ? `"${pre.selectedAnswer.replace(/"/g, '""')}"` : "-",
        pre ? (pre.isCorrect ? "Benar" : "Salah") : "-",
        pre ? pre.confidenceScore : "-",
        post ? `"${post.selectedAnswer.replace(/"/g, '""')}"` : "-",
        post ? (post.isCorrect ? "Benar" : "Salah") : "-",
        post ? post.confidenceScore : "-"
      ]);
    }
    
    const preScore = user.preTest ? `${user.preTest.score}/15` : "-";
    const postScore = user.postTest ? `${user.postTest.score}/15` : "-";
    const improvement = (user.preTest && user.postTest) ? user.postTest.score - user.preTest.score : null;
    const improvementStr = improvement !== null ? (improvement > 0 ? `+${improvement}` : `${improvement}`) : "-";
    const confPre = user.preTest ? avgConf(user.preTest.answers) : "-";
    const confPost = user.postTest ? avgConf(user.postTest.answers) : "-";

    const summaryHeaders = ["Pre-Test", "Post-Test", "Peningkatan", "Conf. Pre-Test", "Conf. Post-Test"];
    const summaryData = [
      preScore,
      postScore,
      improvementStr,
      confPre !== "–" ? `${confPre} (1-5)` : "-",
      confPost !== "–" ? `${confPost} (1-5)` : "-"
    ];
    
    const csvContent = [
      headers.join(","), 
      ...rows.map(e => e.join(",")),
      "",
      summaryHeaders.join(","),
      summaryData.join(",")
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `hasil-tes-${user.name?.replace(/\\s+/g, '-').toLowerCase() || 'user'}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 md:px-7 py-4 md:py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800">{user.name}</h2>
            <p className="text-xs md:text-sm text-slate-500">{user.email}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors">✕</button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 md:px-7 pt-3 md:pt-4 gap-3">
          <div className="flex flex-wrap gap-1">
            {(["test", "ai"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold transition-all ${tab === t ? "bg-blue-600 text-white shadow" : "text-slate-500 hover:bg-slate-100"}`}>
                {t === "test" ? "📊 Hasil Tes & Conf." : `💬 Riwayat AI (${user.interactions.length})`}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {tab === "test" && (user.preTest || user.postTest) && (
              <button onClick={downloadCSV} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 text-white text-xs md:text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5 md:gap-2 shadow-sm">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                CSV
              </button>
            )}
            {tab === "ai" && user.interactions.length > 0 && (
              <button onClick={downloadJSON} className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 text-white text-xs md:text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-1.5 md:gap-2 shadow-sm">
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                JSON
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-4 md:p-7">
          {tab === "test" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <StatCard label="Pre-Test" value={user.preTest ? `${user.preTest.score}/15` : "–"} color="bg-blue-50 text-blue-800 border-blue-100" />
                <StatCard label="Post-Test" value={user.postTest ? `${user.postTest.score}/15` : "–"} color="bg-emerald-50 text-emerald-800 border-emerald-100" />
                <StatCard label="Peningkatan" value={improvement !== null ? (improvement >= 0 ? `+${improvement}` : `${improvement}`) : "–"} color={`${improvement !== null && improvement >= 0 ? "bg-green-50 text-green-800 border-green-100" : "bg-red-50 text-red-800 border-red-100"}`} />
                <StatCard label="Conf. Pre-Test" value={avgConf(user.preTest?.answers ?? [])} sub="(1–5)" color="bg-indigo-50 text-indigo-800 border-indigo-100" />
                <StatCard label="Conf. Post-Test" value={avgConf(user.postTest?.answers ?? [])} sub="(1–5)" color="bg-teal-50 text-teal-800 border-teal-100" />
              </div>

              {radarData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-4 text-center">Confidence Pre-Test</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="soal" tick={{ fontSize: 11 }} />
                        <Radar name="Pre-Conf" dataKey="Pre-Conf" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <p className="text-sm font-bold text-slate-700 mb-4 text-center">Confidence Post-Test</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="soal" tick={{ fontSize: 11 }} />
                        <Radar name="Post-Conf" dataKey="Post-Conf" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.preTest && (
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-3 text-center">Jawaban Pre-Test</p>
                    <div className="grid grid-cols-1 gap-2">
                      {user.preTest.answers.map(a => (
                        <div key={a.questionId} className={`flex items-center justify-between px-3 md:px-4 py-2 rounded-xl border text-[10px] md:text-sm ${a.isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                          <span className="font-medium text-slate-700 w-12 md:w-auto">Soal {a.questionId}</span>
                          <span className={`font-bold flex-1 text-center md:text-left ${a.isCorrect ? "text-emerald-600" : "text-red-600"}`}>{a.isCorrect ? "✓ Benar" : "✗ Salah"}</span>
                          <span className="text-slate-500 text-right">Conf: <strong>{a.confidenceScore}</strong>/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {user.postTest && (
                  <div>
                    <p className="text-sm font-bold text-slate-700 mb-3 text-center">Jawaban Post-Test</p>
                    <div className="grid grid-cols-1 gap-2">
                      {user.postTest.answers.map(a => (
                        <div key={a.questionId} className={`flex items-center justify-between px-3 md:px-4 py-2 rounded-xl border text-[10px] md:text-sm ${a.isCorrect ? "bg-emerald-50 border-emerald-100" : "bg-red-50 border-red-100"}`}>
                          <span className="font-medium text-slate-700 w-12 md:w-auto">Soal {a.questionId}</span>
                          <span className={`font-bold flex-1 text-center md:text-left ${a.isCorrect ? "text-emerald-600" : "text-red-600"}`}>{a.isCorrect ? "✓ Benar" : "✗ Salah"}</span>
                          <span className="text-slate-500 text-right">Conf: <strong>{a.confidenceScore}</strong>/5</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "ai" && (
            <div className="space-y-3">
              {user.interactions.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-4xl mb-3">💬</p>
                  <p className="font-medium">Belum ada riwayat interaksi AI</p>
                </div>
              )}
              {user.interactions.map((int, idx) => (
                <div key={int.id} className="border border-slate-100 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setExpandedChat(expandedChat === int.id ? null : int.id)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                  >
                    <span className="text-sm font-bold text-slate-700">Sesi {user.interactions.length - idx}</span>
                    <span className="text-xs text-slate-400">{new Date(int.createdAt).toLocaleString("id-ID")}</span>
                    <span className="text-slate-400">{expandedChat === int.id ? "▲" : "▼"}</span>
                  </button>
                  {expandedChat === int.id && (
                    <div className="p-5 space-y-3">
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-xs font-bold text-blue-600 mb-2">USER</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{int.userInput}</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-slate-100">
                        <p className="text-xs font-bold text-emerald-600 mb-2">AI TUTOR</p>
                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{int.aiOutput}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardClient({ stats, users, adminName }: { stats: Stats; users: User[]; adminName: string }) {
  const [search, setSearch] = useState("");
  const [filterLevel, setFilterLevel] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const getStatus = (u: User) => {
    if (!u.preTest) return "NO_PRE";
    if (u.interactions.length < 5) return "IN_AI";
    if (!u.postTest) return "READY_POST";
    return "DONE";
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchLevel = filterLevel === "ALL" || u.level === filterLevel || (filterLevel === "NONE" && !u.level);
    const matchStatus = filterStatus === "ALL" || getStatus(u) === filterStatus;
    return matchSearch && matchLevel && matchStatus;
  });

  const levelChartData = [
    { name: "Belum", value: stats.levelDistribution.NONE, fill: "#94a3b8" },
    { name: "Pemula", value: stats.levelDistribution.BEGINNER, fill: "#f59e0b" },
    { name: "Menengah", value: stats.levelDistribution.INTERMEDIATE, fill: "#3b82f6" },
    { name: "Mahir", value: stats.levelDistribution.ADVANCED, fill: "#10b981" },
  ];

  const progressChartData = [
    { name: "Rata-rata Pre-Test", Skor: stats.avgPreScore, fill: "#3b82f6" },
    { name: "Rata-rata Post-Test", Skor: stats.avgPostScore, fill: "#10b981" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {selectedUser && <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />}

      {/* Navbar Admin */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/cdl-guru-logo.jpg" alt="CDL Admin Logo" className="w-10 h-10 object-contain rounded-lg shadow-sm bg-white" />
            <div>
              <span className="font-black text-slate-800 tracking-tight">CDL Admin</span>
              <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full border border-red-200">ADMIN</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm font-bold text-slate-600 hidden sm:block">{adminName}</p>
            <form action={handleSignOut}>
              <button type="submit" className="px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-100 transition-colors">Keluar</button>
            </form>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800">Dashboard Penelitian</h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">Monitoring data seluruh peserta CDL Guru Platform</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <StatCard label="Total Peserta" value={stats.totalUsers} sub="Akun guru terdaftar" color="bg-white text-slate-800 border-slate-100 shadow-sm" />
          <StatCard label="Pre-Test Selesai" value={stats.usersWithPreTest} sub={`${Math.round((stats.usersWithPreTest / stats.totalUsers || 0) * 100)}% peserta`} color="bg-blue-50 text-blue-800 border-blue-100" />
          <StatCard label="Post-Test Selesai" value={stats.usersWithPostTest} sub={`dari ${stats.usersWithPreTest} pre-test`} color="bg-emerald-50 text-emerald-800 border-emerald-100" />
          <StatCard label="Peningkatan Rata-rata" value={`${stats.avgImprovement >= 0 ? "+" : ""}${stats.avgImprovement}`} sub="Poin pre→post" color="bg-purple-50 text-purple-800 border-purple-100" />
          <StatCard label="Total Interaksi AI" value={stats.totalInteractions} sub={`Avg conf. ${stats.avgConfidenceAll}/5`} color="bg-orange-50 text-orange-800 border-orange-100" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5">Distribusi Level Peserta</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={levelChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" name="Peserta" radius={[6, 6, 0, 0]}>
                  {levelChartData.map((entry, i) => (
                    <rect key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-sm font-black text-slate-700 uppercase tracking-widest mb-5">Rata-rata Skor Pre vs Post</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 15]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="Skor" radius={[6, 6, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tindakan Admin */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <PushNotificationSender />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl border border-blue-600 shadow-sm p-6 text-white h-full flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              </div>
              <h2 className="text-xl font-black mb-2 relative z-10">Pusat Kendali Riset</h2>
              <p className="text-blue-100 text-sm relative z-10 max-w-lg mb-4">Gunakan panel di sebelah kiri untuk mengirimkan notifikasi PWA langsung ke perangkat peserta. Notifikasi akan diterima seketika oleh pengguna yang telah mengizinkannya di Dashboard mereka.</p>
              <div className="flex gap-2 relative z-10">
                <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold border border-white/30 backdrop-blur-sm">Real-time Push</span>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold border border-white/30 backdrop-blur-sm">VAPID Secured</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau email..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ALL">Semua Level</option>
              <option value="NONE">Belum ada level</option>
              <option value="BEGINNER">Pemula</option>
              <option value="INTERMEDIATE">Menengah</option>
              <option value="ADVANCED">Mahir</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="ALL">Semua Status</option>
              <option value="NO_PRE">Belum Pre-Test</option>
              <option value="IN_AI">Proses AI</option>
              <option value="READY_POST">Siap Post-Test</option>
              <option value="DONE">Selesai</option>
            </select>
          </div>

          <p className="text-xs text-slate-400 font-medium mb-3">Menampilkan {filtered.length} dari {users.length} peserta</p>

          <div className="overflow-x-auto pb-4">
            <table className="w-full text-xs md:text-sm min-w-[700px]">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  <th className="text-left pb-3 pr-4">Peserta</th>
                  <th className="text-center pb-3 pr-4">Level</th>
                  <th className="text-center pb-3 pr-4">Pre-Test</th>
                  <th className="text-center pb-3 pr-4">Post-Test</th>
                  <th className="text-center pb-3 pr-4">Δ</th>
                  <th className="text-center pb-3 pr-4">AI Sesi</th>
                  <th className="text-center pb-3 pr-4">Status</th>
                  <th className="text-center pb-3">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => {
                  const imp = u.preTest && u.postTest ? u.postTest.score - u.preTest.score : null;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="font-bold text-slate-800">{u.name}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </td>
                      <td className="py-3 pr-4 text-center">
                        {u.level ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${LEVEL_COLOR[u.level] ?? "bg-slate-100 text-slate-500"}`}>
                            {u.level === "BEGINNER" ? "Pemula" : u.level === "INTERMEDIATE" ? "Menengah" : "Mahir"}
                          </span>
                        ) : <span className="text-slate-300">–</span>}
                      </td>
                      <td className="py-3 pr-4 text-center font-bold text-blue-700">{u.preTest ? `${u.preTest.score}/15` : <span className="text-slate-300">–</span>}</td>
                      <td className="py-3 pr-4 text-center font-bold text-emerald-700">{u.postTest ? `${u.postTest.score}/15` : <span className="text-slate-300">–</span>}</td>
                      <td className="py-3 pr-4 text-center font-black">
                        {imp !== null ? <span className={imp >= 0 ? "text-emerald-600" : "text-red-600"}>{imp >= 0 ? "+" : ""}{imp}</span> : <span className="text-slate-300">–</span>}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span className={`font-bold ${u.interactions.length >= 5 ? "text-emerald-600" : "text-slate-500"}`}>{u.interactions.length}</span>
                        <span className="text-slate-300">/5</span>
                      </td>
                      <td className="py-3 pr-4 text-center"><StatusBadge user={u} /></td>
                      <td className="py-3 text-center">
                        <button onClick={() => setSelectedUser(u)}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100">
                          Lihat →
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-slate-400 font-medium">Tidak ada data yang sesuai filter</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
