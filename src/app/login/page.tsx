import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  
  // Guard: If already logged in, redirect based on role
  if (session?.user) {
    if ((session.user as any).role === 'ADMIN') redirect('/admin');
    else redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="max-w-md w-full">
        <div className="text-center mb-6 md:mb-10">
          <div className="mx-auto w-32 md:w-48 h-auto mb-4 md:mb-6 transform hover:scale-105 transition-transform duration-300">
            <img src="/cdl-guru-logo.jpg" alt="CDL Guru Logo" className="w-full h-auto object-contain drop-shadow-xl rounded-xl" />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 md:p-10">
          <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-6 md:mb-8 flex items-center gap-2">
            Selamat Datang 👋
          </h2>
          <LoginForm />
        </div>

        <p className="text-center text-slate-400 text-xs mt-10 font-medium uppercase tracking-widest">
          Research Initiative 2026
        </p>
      </div>
    </div>
  );
}
