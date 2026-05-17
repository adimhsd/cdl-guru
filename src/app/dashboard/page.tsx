import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import LevelBadge from "@/components/LevelBadge";
import ProgressBar from "@/components/ProgressBar";
import PostTestButton from "./PostTestButton";
import PushNotificationToggle from "@/components/PushNotificationToggle";

type TestResult = { score: number; level: string; completedAt: Date } | null;

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Pemula",
  INTERMEDIATE: "Menengah",
  ADVANCED: "Mahir",
};

const LEVEL_DESCRIPTIONS: Record<string, string> = {
  BEGINNER: "Anda sedang membangun fondasi literasi digital kritis.",
  INTERMEDIATE: "Anda mulai mampu mengevaluasi informasi secara mandiri.",
  ADVANCED: "Anda siap menganalisis informasi secara kritis dan mendalam.",
};

const LEVEL_UI_CONFIG: Record<string, { bar: string; bg: string; border: string }> = {
  BEGINNER:     { bar: "bg-amber-400",    bg: "bg-amber-50",    border: "border-amber-200" },
  INTERMEDIATE: { bar: "bg-blue-500",     bg: "bg-blue-50",     border: "border-blue-200"  },
  ADVANCED:     { bar: "bg-emerald-500", bg: "bg-emerald-50",  border: "border-emerald-200" },
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userRole = (session.user as any).role;
  if (userRole === "ADMIN") redirect("/admin");

  const userId = session.user.id;

  const [user, preTest, postTest, interactionCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, level: true },
    }),
    prisma.testResult.findFirst({
      where: { userId, type: "PRE_TEST" },
      select: { score: true, level: true, completedAt: true },
    }),
    prisma.testResult.findFirst({
      where: { userId, type: "POST_TEST" },
      select: { score: true, level: true, completedAt: true },
    }),
    prisma.interaction.count({ where: { userId } }),
  ]);

  if (!user) redirect("/login");

  // Flow Guard: If logged in but no pre-test, you can still see dashboard but action button will guide you
  const level = user.level ?? "BEGINNER";
  const improvement = preTest && postTest ? postTest.score - preTest.score : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={user.name} userEmail={user.email} level={level} />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Progres</h1>
          <p className="text-slate-500 mt-1">Pantau perkembangan literasi digital kritis Anda di sini.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section: Skor */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Hasil Evaluasi
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100">
                <p className="text-xs font-bold text-blue-600 mb-2 uppercase">Pre-Test</p>
                {preTest ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-blue-700">{preTest.score}</span>
                    <span className="text-blue-400 font-medium">/15</span>
                  </div>
                ) : <p className="text-blue-400 text-sm font-medium">Belum ada data</p>}
              </div>

              <div className={`${postTest ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50/50 border-slate-100'} rounded-2xl p-5 border`}>
                <p className={`text-xs font-bold mb-2 uppercase ${postTest ? 'text-emerald-600' : 'text-slate-400'}`}>Post-Test</p>
                {postTest ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-emerald-700">{postTest.score}</span>
                    <span className="text-emerald-400 font-medium">/15</span>
                  </div>
                ) : <p className="text-slate-400 text-sm font-medium">Belum tersedia</p>}
              </div>
            </div>

            <div className="space-y-5 mb-8">
              <ProgressBar 
                progress={preTest ? (preTest.score / 15) * 100 : 0} 
                label="Capaian Pre-Test" 
                subLabel={preTest ? `${preTest.score} / 15` : '0 / 15'} 
                color="bg-blue-500"
              />
              <ProgressBar 
                progress={postTest ? (postTest.score / 15) * 100 : 0} 
                label="Capaian Post-Test" 
                subLabel={postTest ? `${postTest.score} / 15` : '0 / 15'} 
                color="bg-emerald-500"
              />
            </div>

            {improvement !== null && (
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${improvement >= 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                <span className="text-sm font-bold text-slate-600">Peningkatan Skor</span>
                <span className={`text-xl font-black ${improvement >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {improvement > 0 ? '+' : ''}{improvement} Poin
                </span>
              </div>
            )}
          </section>

          {/* Section: Level & Action */}
          <div className="space-y-6">
            <section className={`rounded-3xl border shadow-sm p-8 ${LEVEL_UI_CONFIG[level]?.bg} ${LEVEL_UI_CONFIG[level]?.border}`}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Level Literasi Digital</h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-3xl">
                  {level === 'ADVANCED' ? '🎯' : level === 'INTERMEDIATE' ? '📚' : '🌱'}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">{LEVEL_LABELS[level]}</h3>
                  <LevelBadge level={level} />
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">
                {LEVEL_DESCRIPTIONS[level]}
              </p>
            </section>

            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Aktivitas Belajar</h2>
              <div className="mb-6">
                <ProgressBar 
                  progress={(interactionCount / 10) * 100} 
                  label="Interaksi AI Tutor" 
                  subLabel={`${interactionCount} / 10 Sesi`} 
                  color={interactionCount >= 10 ? 'bg-emerald-500' : 'bg-blue-500'}
                  height="h-3"
                />
              </div>

              <div className="space-y-3">
                {!preTest ? (
                  <a href="/pretest" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Mulai Pre-Test Sekarang
                  </a>
                ) : interactionCount < 10 ? (
                  <a href="/ai" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                    Lanjut Berlatih dengan AI
                  </a>
                ) : !postTest ? (
                  <PostTestButton />
                ) : (
                  <a href="/ai" className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all border border-slate-200">
                    Ulangi Sesi AI Tutor
                  </a>
                )}
              </div>
            </section>

            {/* Section: Notifikasi */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Notifikasi
              </h2>
              <PushNotificationToggle />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
