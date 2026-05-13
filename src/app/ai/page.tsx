import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AIChatClient from "./AIChatClient";

export default async function AIPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  // Guard: Must complete pre-test first
  const preTest = await prisma.testResult.findFirst({
    where: { userId, type: "PRE_TEST" },
  });
  
  if (!preTest) {
    redirect("/pretest");
  }

  // Fetch initial interaction count & user level
  const [user, interactionCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, level: true },
    }),
    prisma.interaction.count({ where: { userId } }),
  ]);

  if (!user) redirect("/login");

  return (
    <AIChatClient 
      user={user} 
      initialInteractionCount={interactionCount} 
    />
  );
}
