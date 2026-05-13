"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PRE_TEST_QUESTIONS, shuffleOptions, Question } from "@/lib/questions";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";

type Answer = {
  questionId: number;
  selectedAnswer: string;
  confidenceScore: number;
};

const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Sangat tidak yakin",
  2: "Tidak yakin",
  3: "Cukup yakin",
  4: "Yakin",
  5: "Sangat yakin",
};

export default function PreTestClient({ user, userId }: { user: any, userId: string }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [confidenceScore, setConfidenceScore] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const shuffled = shuffleOptions(PRE_TEST_QUESTIONS, userId);
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

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / 15) * 100;
  const isLastQuestion = currentIndex === 14;
  const canProceed = selectedAnswer !== "" && confidenceScore > 0;

  const saveCurrentAnswer = () => {
    const current: Answer = { questionId: currentQuestion.id, selectedAnswer, confidenceScore };
    setAnswers(prev => [...prev.filter(a => a.questionId !== currentQuestion.id), current]);
    return current;
  };

  const transitionTo = (nextIndex: number) => {
    setIsTransitioning(true);
    setVisible(false);
    setTimeout(() => { setCurrentIndex(nextIndex); setVisible(true); setIsTransitioning(false); }, 250);
  };

  const handleSubmit = async () => {
    if (!canProceed) return;
    const lastAnswer = saveCurrentAnswer();
    const allAnswers = [...answers.filter(a => a.questionId !== currentQuestion.id), lastAnswer];
    if (allAnswers.length !== 15) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/test/pretest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: allAnswers }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan jawaban");
      router.push("/ai");
    } catch (err) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  if (questions.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Navbar userName={user.name} showNav={false} />
      
      <div className="max-w-3xl mx-auto px-4 mt-8">
        <ProgressBar 
          progress={progress} 
          label="Progres Pre-Test" 
          subLabel={`Soal ${currentIndex + 1} / 15`}
        />

        <div className="flex gap-1.5 mt-4 flex-wrap">
          {questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => { saveCurrentAnswer(); transitionTo(i); }}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                i === currentIndex ? "bg-blue-600 text-white shadow-lg scale-110" : 
                answers.some(a => a.questionId === q.id) ? "bg-blue-100 text-blue-700" : "bg-white text-slate-400 border border-slate-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className={`mt-8 transition-all duration-250 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm mb-6">
            <span className="inline-block mb-4 text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
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
                    selected ? "border-blue-600 bg-blue-600 text-white shadow-xl" : "border-white bg-white text-slate-700 hover:border-blue-200"
                  }`}
                >
                  <span className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-xl font-black text-xs ${
                    selected ? "bg-white text-blue-600" : "bg-slate-100 text-slate-500 group-hover:bg-blue-50"
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
                      confidenceScore === n ? "bg-blue-600 border-blue-600 text-white shadow-lg" : "bg-slate-50 border-transparent text-slate-400 hover:bg-blue-50 hover:text-blue-600"
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
                className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 disabled:opacity-40"
              >
                Selanjutnya →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed || isSubmitting}
                className="flex-1 py-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 disabled:opacity-40"
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
