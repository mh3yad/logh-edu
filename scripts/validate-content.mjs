// npm run validate — بيفحص كل ملفات quiz.json ويقولك فين الغلط بالظبط
import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "content", "courses");
let bad = 0;
let total = 0;

function check(q, n) {
  const e = (m) => `السؤال ${n}: ${m}`;
  if (typeof q.question !== "string" || !q.question.trim()) return e('"question" مطلوب');
  if (q.type === "tf") return typeof q.answer === "boolean" ? null : e('"answer" لازم true/false');
  if (q.type === "mc" || q.type === "cc") {
    if (!Array.isArray(q.options) || q.options.length < 2 || q.options.length > 4)
      return e('"options" من 2 لـ 4');
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
      return e(`"answer" لازم من 0 لـ ${q.options.length - 1}`);
    if (q.type === "cc" && !(q.code ?? "").includes("___")) return e('"code" لازم فيه ___');
    return null;
  }
  return e('"type" لازم mc / tf / cc');
}

function walk(dir) {
  for (const ent of fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }) : []) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.name === "quiz.json") {
      total++;
      try {
        const j = JSON.parse(fs.readFileSync(p, "utf8"));
        if (!j.title) throw new Error('"title" مطلوب');
        if (!Array.isArray(j.questions) || !j.questions.length) throw new Error('"questions" فاضية');
        const errs = j.questions.map((q, i) => check(q, i + 1)).filter(Boolean);
        if (errs.length) throw new Error(errs.join("\n    "));
        console.log(`✔ ${path.relative(root, p)} (${j.questions.length} أسئلة)`);
      } catch (err) {
        bad++;
        console.log(`✘ ${path.relative(root, p)}\n    ${err.message}`);
      }
    }
  }
}

walk(root);
console.log(`\n${total - bad}/${total} ملف سليم`);
process.exit(bad ? 1 : 0);
