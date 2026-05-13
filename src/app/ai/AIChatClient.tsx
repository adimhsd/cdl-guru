"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProgressBar from "@/components/ProgressBar";
import LoadingSpinner from "@/components/LoadingSpinner";

type Role = "user" | "assistant";

type ChatMessage = {
  id: string
  role: Role
  content: string
  timestamp: Date
}

type User = {
  name: string | null
  email: string | null
  level: string | null
}

function uid() {
  return Math.random().toString(36).slice(2);
}

/** Renders AI markdown-lite responses */
function AIBubble({ content }: { content: string }) {
  const lines = content.split("\n");
  return (
    <div className="text-sm text-slate-700 leading-relaxed space-y-1">
      {lines.map((line, i) => {
        const t = line.trim();
        if (!t) return <div key={i} className="h-1" />;
        if (t.startsWith("**") && t.endsWith("**"))
          return <p key={i} className="font-bold text-slate-800 mt-2">{t.replace(/\*\*/g, "")}</p>;
        if (/^\d+\.\s/.test(t))
          return <p key={i} className="font-semibold text-slate-800 mt-2">{t}</p>;
        if (t.startsWith("- ") || t.startsWith("• "))
          return (
            <p key={i} className="pl-3 text-slate-600">
              <span className="text-blue-500 mr-1">•</span>
              {t.replace(/^[-•]\s/, "")}
            </p>
          );
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function AIChatClient({ user, initialInteractionCount }: { user: User, initialInteractionCount: number }) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interactionCount, setInteractionCount] = useState(initialInteractionCount);
  const [showPostTestWarning, setShowPostTestWarning] = useState(false);
  
  // Streaming refs
  const charQueueRef = useRef<string>("");
  const streamDoneRef = useRef(false);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingMetaRef = useRef<{ interactionCount: number } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Welcome message
    setMessages([{
      id: uid(),
      role: "assistant",
      content: `Halo ${user.name}! Saya AI CDL Tutor Anda 👋\n\nSilakan kirimkan artikel atau teks yang ingin Anda analisis secara kritis. Saya akan membantu Anda mendeteksi bias, mengevaluasi sumber, dan memberikan pertanyaan reflektif.\n\nSetiap pesan Anda dihitung sebagai 1 interaksi. Minimal **10 interaksi** untuk membuka Post-Test.`,
      timestamp: new Date(),
    }]);
  }, [user.name]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading || (trimmedInput.split(/\s+/).length > 500)) return;
    
    setInput("");
    const userMsg: ChatMessage = { id: uid(), role: "user", content: trimmedInput, timestamp: new Date() };
    const aiPlaceholderId = uid();
    const aiPlaceholder: ChatMessage = { id: aiPlaceholderId, role: "assistant", content: "", timestamp: new Date() };

    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, aiPlaceholder]);
    setIsLoading(true);

    charQueueRef.current = "";
    streamDoneRef.current = false;
    pendingMetaRef.current = null;
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);

    try {
      const history = newMessages
        .filter(m => m.role === "user" || m.role === "assistant")
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmedInput, history }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "AI sedang tidak tersedia, coba beberapa saat lagi.");
      }

      typingIntervalRef.current = setInterval(() => {
        if (charQueueRef.current.length > 0) {
          const take = Math.min(2, charQueueRef.current.length);
          const chars = charQueueRef.current.slice(0, take);
          charQueueRef.current = charQueueRef.current.slice(take);
          setMessages(prev => prev.map(m => m.id === aiPlaceholderId ? { ...m, content: m.content + chars } : m));
        } else if (streamDoneRef.current) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          if (pendingMetaRef.current) setInteractionCount(pendingMetaRef.current.interactionCount);
        }
      }, 30);

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error("Stream failure");

      setIsLoading(false);
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const raw = decoder.decode(value, { stream: true });
        const metaIdx = raw.indexOf("\x00META");
        if (metaIdx !== -1) {
          charQueueRef.current += raw.slice(0, metaIdx);
          try { pendingMetaRef.current = JSON.parse(raw.slice(metaIdx + 5)); } catch {}
        } else {
          charQueueRef.current += raw;
        }
      }
      streamDoneRef.current = true;
    } catch (err: any) {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setIsLoading(false);
      setMessages(prev => prev.map(m => m.id === aiPlaceholderId ? { ...m, content: `⚠️ ${err.message}` } : m));
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <Navbar userName={user.name} userEmail={user.email} level={user.level || 'BEGINNER'} />
      
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-8 flex flex-col">
        <div className="bg-white/80 backdrop-blur-sm border border-blue-100 rounded-2xl p-4 shadow-sm mb-8">
          <ProgressBar 
            progress={(interactionCount / 10) * 100} 
            label="Progres Syarat Post-Test" 
            subLabel={`${interactionCount} / 10 Interaksi`}
            color={interactionCount >= 10 ? 'bg-emerald-500' : 'bg-blue-500'}
          />
          {interactionCount >= 10 && (
            <button 
              onClick={() => setShowPostTestWarning(true)}
              className="mt-3 w-full py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-100"
            >
              Post-Test Tersedia! Klik untuk Memulai →
            </button>
          )}
        </div>

        <div className="space-y-6 flex-1 pb-8">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-5 py-3 shadow-sm ${
                msg.role === "user" ? "bg-blue-600 text-white rounded-tr-sm" : "bg-white border border-slate-100 rounded-tl-sm"
              }`}>
                {msg.role === "user" ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p> : <AIBubble content={msg.content} />}
                <p className={`text-[10px] mt-1.5 font-medium ${msg.role === "user" ? "text-blue-200 text-right" : "text-slate-400"}`}>
                  {msg.timestamp.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && <div className="flex justify-start"><div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm"><LoadingSpinner message="AI sedang berpikir..." /></div></div>}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 z-20 bg-slate-50/90 backdrop-blur-md border-t border-slate-200 pb-6 pt-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tulis pesan Anda di sini..."
              rows={1}
              className="flex-1 resize-none border border-slate-200 rounded-2xl px-5 py-3.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-40 shadow-lg shadow-blue-100 shrink-0"
            >
              <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 mt-3 text-center font-medium">Maksimal 500 kata per pesan</p>
        </div>
      </div>

      {showPostTestWarning && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-5 shadow-inner">
              ⚠️
            </div>
            <h2 className="text-2xl font-black text-slate-800 text-center mb-3 tracking-tight">Konfirmasi Post-Test</h2>
            <p className="text-slate-600 text-center leading-relaxed mb-8 font-medium">
              Setelah Post-Test dilakukan, Anda akan mengakhiri seluruh proses pembelajaran CDL di platform ini. 
              <br /><br />
              Pastikan Anda merasa sudah cukup berlatih. Jika belum yakin, silakan kembali berinteraksi dengan AI Asisten sampai Anda merasa memiliki kemampuan yang cukup baik.
            </p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setShowPostTestWarning(false)} 
                className="w-full py-4 px-4 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100 transition-colors text-center"
              >
                Kembali berinteraksi dengan AI Asisten
              </button>
              <button 
                onClick={() => router.push('/posttest')} 
                className="w-full py-4 px-4 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors text-center shadow-lg shadow-emerald-200"
              >
                Lanjut Post-Test →
              </button>
              <button 
                onClick={() => setShowPostTestWarning(false)} 
                className="mt-2 text-sm text-slate-400 font-medium hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
