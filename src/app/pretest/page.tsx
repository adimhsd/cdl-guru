import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PreTestClient from "./PreTestClient";

export default async function PreTestPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userRole = (session.user as any).role;
  if (userRole === "ADMIN") redirect("/admin");

  const userId = session.user.id;

  // Guard: If already finished pre-test, go to dashboard
  const preTest = await prisma.testResult.findFirst({
    where: { userId, type: "PRE_TEST" },
  });
  
  if (preTest) {
    redirect("/dashboard");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true },
  });

  if (!user) redirect("/login");

  return <PreTestClient user={user} userId={userId} />;
}
