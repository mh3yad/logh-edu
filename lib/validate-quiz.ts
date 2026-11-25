import type { Question, Quiz } from "./types";

/**
 * بيتأكد إن ملف quiz.json سليم، ولو فيه غلط بيرمي رسالة واضحة
 * فيها رقم السؤال والمشكلة بالظبط.
 */
export function parseQuiz(raw: unknown, where: string): Quiz {
  const fail = (msg: string): never => {
    throw new Error(`[${where}] ${msg}`);
  };

  if (typeof raw !== "object" || raw === null) fail("الملف لازم يكون JSON object");
  const r = raw as Record<string, unknown>;

  if (typeof r.title !== "string" || !r.title.trim()) fail('الحقل "title" مطلوب');
  if (!Array.isArray(r.questions) || r.questions.length === 0)
    fail('الحقل "questions" لازم يكون array فيه سؤال واحد على الأقل');

  const questions: Question[] = (r.questions as unknown[]).map((item, i) => {
    const n = i + 1;
    const q = item as Record<string, unknown>;
    if (typeof q !== "object" || q === null) return fail(`السؤال ${n}: لازم يكون object`);
    if (typeof q.question !== "string" || !q.question.trim())
      return fail(`السؤال ${n}: الحقل "question" مطلوب`);
    if (q.code !== undefined && typeof q.code !== "string")
      return fail(`السؤال ${n}: "code" لازم يكون نص`);
    if (q.explanation !== undefined && typeof q.explanation !== "string")
      return fail(`السؤال ${n}: "explanation" لازم يكون نص`);
    if (q.points !== undefined && typeof q.points !== "number")
      return fail(`السؤال ${n}: "points" لازم يكون رقم`);

    switch (q.type) {
      case "tf":
        if (typeof q.answer !== "boolean")
          return fail(`السؤال ${n} (tf): "answer" لازم يكون true أو false`);
        return q as unknown as Question;
      case "mc":
      case "cc": {
        const t = q.type as string;
        if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4)
          return fail(`السؤال ${n} (${t}): "options" لازم يكون من 2 لـ 4 اختيارات`);
        if (!q.options.every((o) => typeof o === "string"))
          return fail(`السؤال ${n} (${t}): كل الاختيارات لازم تكون نصوص`);
        if (
          typeof q.answer !== "number" ||
          !Number.isInteger(q.answer) ||
          q.answer < 0 ||
          q.answer >= q.options.length
        )
          return fail(
            `السؤال ${n} (${t}): "answer" لازم يكون رقم الاختيار الصح (من 0 لـ ${q.options.length - 1})`
          );
        if (t === "cc" && !(typeof q.code === "string" && q.code.includes("___")))
          return fail(`السؤال ${n} (cc): حقل "code" لازم يكون موجود وفيه ___ مكان الناقص`);
        return q as unknown as Question;
      }
      default:
        return fail(`السؤال ${n}: "type" لازم يكون واحد من mc / tf / cc`);
    }
  });

  return {
    title: r.title as string,
    description: typeof r.description === "string" ? r.description : undefined,
    timePerQuestion: typeof r.timePerQuestion === "number" ? r.timePerQuestion : 30,
    points: typeof r.points === "number" ? r.points : 10,
    questions,
  };
}
