import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostTestClient from "./PostTestClient";

export default async function PostTestPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userRole = (session.user as any).role;
  if (userRole === "ADMIN") redirect("/admin");

  const userId = session.user.id;

  // Guard 1: Must have finished pre-test
  const preTest = await prisma.testResult.findFirst({
    where: { userId, type: "PRE_TEST" },
  });
  if (!preTest) redirect("/pretest");

  // Guard 2: Must have at least 10 interactions
  const interactionCount = await prisma.interaction.count({ where: { userId } });
  if (interactionCount < 10) {
    // Redirect to AI with a specific flag maybe? Or just /ai
    redirect("/ai");
  }

  // Guard 3: Must NOT have finished post-test already
  const existingPostTest = await prisma.testResult.findFirst({
    where: { userId, type: "POST_TEST" },
  });
  if (existingPostTest) redirect("/dashboard");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { name: true, email: true, level: true },
  });

  if (!user) redirect("/login");

  return <PostTestClient user={user} userId={userId} />;
}
