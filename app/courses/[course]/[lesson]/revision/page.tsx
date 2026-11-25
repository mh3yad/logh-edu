import { notFound } from "next/navigation";
import ContentView from "@/components/ContentView";
import { getLessonFile } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function RevisionPage({
  params,
}: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course, lesson } = await params;
  const file = getLessonFile(course, lesson, "revision");
  if (!file) notFound();
  return <ContentView file={file} title="المراجعة" />;
}
