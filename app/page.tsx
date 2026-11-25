import Link from "next/link";
import { getCourses, getLessons } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function Home() {
  const courses = getCourses();
  return (
    <main className="page">
      <h1>الكورسات</h1>
      <p className="lead">اختار كورس وابدأ: شرح، مراجعة، واختبار لكل درس.</p>
      {courses.length === 0 ? (
        <div className="empty">
          مفيش كورسات لسه. اعمل فولدر جديد جوه <code>content/courses</code>.
        </div>
      ) : (
        <div className="grid">
          {courses.map((c) => {
            const n = getLessons(c.slug).length;
            return (
              <Link key={c.slug} href={`/courses/${c.slug}`} className="card">
                <div className="ico">{c.icon ?? "📘"}</div>
                <h3>{c.title}</h3>
                {c.description && <p>{c.description}</p>}
                <div className="badges">
                  <span className="badge on">{n} دروس</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
