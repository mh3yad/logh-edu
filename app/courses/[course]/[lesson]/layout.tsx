import Link from "next/link";
import { notFound } from "next/navigation";
import LessonTabs from "@/components/LessonTabs";
import { getCourse, getLesson, getLessons } from "@/lib/content";

export default async function LessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ course: string; lesson: string }>;
}) {
  const { course: cs, lesson: ls } = await params;
  const course = getCourse(cs);
  const lesson = getLesson(cs, ls);
  if (!course || !lesson) notFound();

  const all = getLessons(cs);
  const idx = all.findIndex((l) => l.slug === ls);
  const prev = all[idx - 1];
  const next = all[idx + 1];

  return (
    <main className="page">
      <div className="crumbs">
        <Link href="/">الكورسات</Link> <span>›</span>
        <Link href={`/courses/${cs}`}>{course.title}</Link> <span>›</span>
        <span>{lesson.title}</span>
      </div>
      <h1>{lesson.title}</h1>
      {lesson.description && <p className="lead">{lesson.description}</p>}

      <LessonTabs
        base={`/courses/${cs}/${ls}`}
        hasExplain={lesson.hasExplain}
        hasRevision={lesson.hasRevision}
        hasQuiz={lesson.hasQuiz}
      />

      {children}

      <div className="lesson-nav">
        {prev ? (
          <Link className="btn ghost" href={`/courses/${cs}/${prev.slug}`}>
            → {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn" href={`/courses/${cs}/${next.slug}`}>
            {next.title} ←
          </Link>
        ) : (
          <span />
        )}
      </div>
    </main>
  );
}
