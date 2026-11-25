import { redirect } from "next/navigation";
import { getLesson } from "@/lib/content";

export default async function LessonIndex({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course, lesson: ls } = await params;
  const lesson = getLesson(course, ls);
  const first = lesson?.hasExplain ? "explain" : lesson?.hasRevision ? "revision" : "quiz";
  redirect(`/courses/${course}/${ls}/${first}`);
}
