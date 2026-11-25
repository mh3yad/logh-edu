import { notFound } from "next/navigation";
import Quiz from "@/components/Quiz";
import { getQuiz } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course, lesson } = await params;
  const quiz = getQuiz(course, lesson);
  if (!quiz) notFound();
  return <Quiz quiz={quiz} />;
}
