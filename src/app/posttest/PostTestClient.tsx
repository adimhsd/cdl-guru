"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { POST_TEST_QUESTIONS, shuffleOptions, Question } from "@/lib/questions";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import LevelBadge from "@/components/LevelBadge";

type Answer = {
  questionId: number;
  selectedAnswer: string;
  confidenceScore: number;
};

type ResultData = {
  score: number;
  preTestScore: number;
  improvement: number;
  level: string;
  preTestLevel: string;
};

const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Sangat tidak yakin",
  2: "Tidak yakin",
  3: "Cukup yakin",
  4: "Yakin",
  5: "Sangat yakin",
};

export default function PostTestClient({ user, userId }: { user: any, userId: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    const shuffled = shuffleOptions(POST_TEST_QUESTIONS, userId);
    setQuestions(shuffled);
  }, [userId]);

  useEffect(() => {
    const existing = answers.find(a => a.questionId === questions[currentIndex]?.id);
    if (existing) {
      setSelectedAnswer(existing.selectedAnswer);
      setConfidenceScore(existing.confidenceScore);
    } else {
      setSelectedAnswer("");
      setConfidenceScore(0);
    }
  }, [currentIndex, questions]);

  const progress = ((currentIndex + 1) / 15) * 100;
  const isLastQuestion = currentIndex === 14;
  const canProceed = selectedAnswer !== "" && confidenceScore > 0;

  const saveCurrentAnswer = useCallback(() => {
    const current: Answer = { questionId: questions[currentIndex].id, selectedAnswer, confidenceScore };
    setAnswers(prev => [...prev.filter(a => a.questionId !== questions[currentIndex].id), current]);
    return current;
  }, [currentIndex, questions, selectedAnswer, confidenceScore]);

  const transitionTo = (nextIndex: number) => {
    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => { setCurrentIndex(nextIndex); setVisible(true); setIsTransitioning(false); }, 250);
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    const lastAnswer = saveCurrentAnswer();
    const allAnswers = [...answers.filter(a => a.questionId !== questions[currentIndex].id), lastAnswer];
    
    if (allAnswers.length !== 15) {
      alert(`Mohon lengkapi semua soal. Anda baru menjawab ${allAnswers.length} dari 15 soal.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/test/posttest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: allAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan jawaban");
      
      // Success: results will be shown via the 'result' state modal
      setResult(data);
    } catch (err: any) {
      alert("Error: " + err.message);
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) return null;

  if (result) {
    return (
      <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-10 text-center animate-in zoom-in duration-300">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">Evaluasi Selesai!</h2>
          <p className="text-slate-500 font-medium mb-8">Terima kasih telah berpartisipasi dalam penelitian ini.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Skor Pre-Test</p>
              <p className="text-3xl font-black text-slate-700">{result.preTestScore}<span className="text-sm font-normal text-slate-300">/15</span></p>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Skor Post-Test</p>
              <p className="text-3xl font-black text-emerald-700">{result.score}<span className="text-sm font-normal text-emerald-300">/15</span></p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 mb-10 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Level Terbaru</p>
              <p className="text-xl font-black text-blue-800">{result.level}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl font-black text-xl ${result.improvement >= 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
              {result.improvement > 0 ? '+' : ''}{result.improvement}
            </div>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-200"
          >
            Selesai & Ke Dashboard →
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar userName={user.name} level={user.level} showNav={false} />
      
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <ProgressBar 
          progress={progress} 
          label="Progres Post-Test" 
          subLabel={`Soal ${currentIndex + 1} / 15`}
          color="bg-emerald-500"
        />

        <div className="flex gap-1.5 mt-4 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => { saveCurrentAnswer(); transitionTo(i); }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex ? "bg-emerald-600 text-white shadow-lg scale-110" : 
                answers.some(a => a.questionId === q.id) ? "bg-emerald-100 text-emerald-700" : "bg-white text-slate-400 border border-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className={`mt-8 transition-all duration-250 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-6">
            <span className="inline-block mb-4 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
              {currentQuestion.dimension}
            </span>
            <p className="text-slate-800 text-base font-bold leading-relaxed">{currentQuestion.text}</p>
          </div>

          <div className="space-y-2.5 mb-8">
            {currentQuestion.options.map((opt) => {
              const selected = selectedAnswer === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => setSelectedAnswer(opt.key)}
                  className={`w-full flex items-center gap-3.5 px-5 py-3.5 rounded-2xl border-2 text-left transition-all group ${
                    selected ? "border-emerald-600 bg-emerald-600 text-white shadow-xl" : "border-white bg-white text-slate-700 hover:border-emerald-200"
                  }`}
                >
                  <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-xs ${
                    selected ? "bg-white text-emerald-600" : "bg-slate-100 text-slate-500 group-hover:bg-emerald-50"
                  }`}>
                    {opt.key}
                  </span>
                  <span className="font-bold text-sm">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {selectedAnswer && (
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-sm font-bold text-slate-800 mb-2">Seberapa yakin Anda dengan jawaban ini?</p>
              <div className="grid grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setConfidenceScore(n)}
                    className={`py-4 rounded-2xl text-sm font-black border-2 transition-all ${
                      confidenceScore === n ? "bg-emerald-600 border-emerald-600 text-white shadow-lg" : "bg-slate-50 border-transparent text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
                <span>Ragu</span>
                <span>Sangat Yakin</span>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {currentIndex > 0 && (
              <button
                onClick={() => { saveCurrentAnswer(); transitionTo(currentIndex - 1); }}
                className="px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Kembali
              </button>
            )}
            {!isLastQuestion ? (
              <button
                onClick={() => { if (canProceed) { saveCurrentAnswer(); transitionTo(currentIndex + 1); } }}
                disabled={!canProceed}
                className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-40"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-40"
              >
                {isSubmitting ? "Menyimpan..." : "Kirim Jawaban ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
