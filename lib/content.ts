import fs from "node:fs";
import path from "node:path";
import type { ContentFile, Course, Lesson, Quiz } from "./types";
import { parseQuiz } from "./validate-quiz";

const COURSES_DIR = path.join(process.cwd(), "content", "courses");

function readJson<T>(file: string): T | null {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}

function dirs(p: string): string[] {
  if (!fs.existsSync(p)) return [];
  return fs
    .readdirSync(p, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

/** "01-backgrounds" -> "backgrounds" (الرقم في أول اسم الفولدر للترتيب بس) */
function stripOrder(name: string) {
  return name.replace(/^\d+[-_]/, "");
}
function folderOrder(name: string, fallback: number) {
  const m = name.match(/^(\d+)[-_]/);
  return m ? Number(m[1]) : fallback;
}

function courseDirFor(slug: string): string | null {
  const hit = dirs(COURSES_DIR).find((d) => stripOrder(d) === slug);
  return hit ? path.join(COURSES_DIR, hit) : null;
}

export function getCourses(): Course[] {
  return dirs(COURSES_DIR)
    .map((folder, i) => {
      const meta = readJson<Partial<Course>>(path.join(COURSES_DIR, folder, "course.json")) ?? {};
      return {
        slug: stripOrder(folder),
        title: meta.title ?? stripOrder(folder),
        description: meta.description,
        icon: meta.icon,
        order: meta.order ?? folderOrder(folder, i + 1),
      } satisfies Course;
    })
    .sort((a, b) => a.order - b.order);
}

export function getCourse(slug: string): Course | null {
  return getCourses().find((c) => c.slug === slug) ?? null;
}

function lessonFile(dir: string, base: string): string | null {
  for (const ext of [".md", ".html"]) {
    const f = path.join(dir, base + ext);
    if (fs.existsSync(f)) return f;
  }
  return null;
}

export function getLessons(courseSlug: string): Lesson[] {
  const courseDir = courseDirFor(courseSlug);
  if (!courseDir) return [];
  const lessonsDir = path.join(courseDir, "lessons");
  return dirs(lessonsDir)
    .map((folder, i) => {
      const dir = path.join(lessonsDir, folder);
      const meta = readJson<{ title?: string; description?: string; order?: number }>(
        path.join(dir, "lesson.json")
      ) ?? {};
      return {
        slug: stripOrder(folder),
        courseSlug,
        title: meta.title ?? stripOrder(folder),
        description: meta.description,
        order: meta.order ?? folderOrder(folder, i + 1),
        hasExplain: !!lessonFile(dir, "explain"),
        hasRevision: !!lessonFile(dir, "revision"),
        hasQuiz: fs.existsSync(path.join(dir, "quiz.json")),
      } satisfies Lesson;
    })
    .sort((a, b) => a.order - b.order);
}

export function getLesson(courseSlug: string, lessonSlug: string): Lesson | null {
  return getLessons(courseSlug).find((l) => l.slug === lessonSlug) ?? null;
}

function lessonDir(courseSlug: string, lessonSlug: string): string | null {
  const courseDir = courseDirFor(courseSlug);
  if (!courseDir) return null;
  const lessonsDir = path.join(courseDir, "lessons");
  const hit = dirs(lessonsDir).find((d) => stripOrder(d) === lessonSlug);
  return hit ? path.join(lessonsDir, hit) : null;
}

export function getLessonFile(
  courseSlug: string,
  lessonSlug: string,
  base: "explain" | "revision"
): ContentFile | null {
  const dir = lessonDir(courseSlug, lessonSlug);
  if (!dir) return null;
  const f = lessonFile(dir, base);
  if (!f) return null;
  return {
    kind: f.endsWith(".html") ? "html" : "md",
    content: fs.readFileSync(f, "utf8"),
  };
}

export function getQuiz(courseSlug: string, lessonSlug: string): Quiz | null {
  const dir = lessonDir(courseSlug, lessonSlug);
  if (!dir) return null;
  const file = path.join(dir, "quiz.json");
  if (!fs.existsSync(file)) return null;
  return parseQuiz(JSON.parse(fs.readFileSync(file, "utf8")), `${courseSlug}/${lessonSlug}/quiz.json`);
}
