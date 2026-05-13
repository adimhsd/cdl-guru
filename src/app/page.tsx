import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  
  if (session?.user) {
    if ((session.user as any).role === 'ADMIN') redirect('/admin');
    else redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
