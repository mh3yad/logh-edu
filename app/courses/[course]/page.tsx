import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, getLessons } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function CoursePage({ params }: { params: Promise<{ course: string }> }) {
  const { course: slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();
  const lessons = getLessons(slug);

  return (
    <main className="page">
      <div className="crumbs">
        <Link href="/">الكورسات</Link> <span>›</span> <span>{course.title}</span>
      </div>
      <h1>
        {course.icon ?? "📘"} {course.title}
      </h1>
      {course.description && <p className="lead">{course.description}</p>}

      {lessons.length === 0 ? (
        <div className="empty">مفيش دروس في الكورس ده لسه.</div>
      ) : (
        <div className="list">
          {lessons.map((l, i) => (
            <Link key={l.slug} href={`/courses/${slug}/${l.slug}`} className="lrow">
              <div className="lnum">{i + 1}</div>
              <div style={{ flex: 1 }}>
                <h3>{l.title}</h3>
                {l.description && <p>{l.description}</p>}
                <div className="badges">
                  <span className={`badge ${l.hasExplain ? "on" : ""}`}>📖 شرح</span>
                  <span className={`badge ${l.hasRevision ? "on" : ""}`}>🔁 مراجعة</span>
                  <span className={`badge ${l.hasQuiz ? "on" : ""}`}>📝 كويز</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
