"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Question, Quiz as QuizType } from "@/lib/types";

const LABEL: Record<Question["type"], string> = {
  mc: "اختيار من متعدد",
  tf: "صح ولا غلط",
  cc: "أكمل الكود",
};
const LETTERS = ["A", "B", "C", "D"];
const isAscii = (s: string) => /^[\x00-\x7F]+$/.test(s);

type Phase = "welcome" | "playing" | "done";
type Picked = number | boolean | "timeout" | null;

export default function Quiz({ quiz }: { quiz: QuizType }) {
  const { questions } = quiz;
  const TL = quiz.timePerQuestion ?? 30;
  const defaultPoints = quiz.points ?? 10;

  const [phase, setPhase] = useState<Phase>("welcome");
  const [name, setName] = useState("");
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [right, setRight] = useState(0);
  const [picked, setPicked] = useState<Picked>(null);
  const [left, setLeft] = useState(TL);
  const nameRef = useRef<HTMLInputElement>(null);

  const q = questions[qi];
  const answered = picked !== null;
  const pointsOf = (x: Question) => x.points ?? defaultPoints;
  const totalPoints = useMemo(
    () => questions.reduce((s, x) => s + (x.points ?? defaultPoints), 0),
    [questions, defaultPoints]
  );
  const counts = useMemo(() => {
    const c = { mc: 0, tf: 0, cc: 0 };
    questions.forEach((x) => c[x.type]++);
    return c;
  }, [questions]);

  const isCorrect = (v: Picked) => v !== null && v !== "timeout" && v === q.answer;

  function submit(v: Picked) {
    if (answered) return;
    setPicked(v);
    if (isCorrect(v)) {
      setScore((s) => s + pointsOf(q));
      setRight((r) => r + 1);
    }
  }

  // timer
  useEffect(() => {
    if (phase !== "playing" || answered || TL <= 0) return;
    const id = setInterval(() => {
      setLeft((l) => {
        const n = l - 0.1;
        return n <= 0 ? 0 : n;
      });
    }, 100);
    return () => clearInterval(id);
  }, [phase, answered, qi, TL]);

  useEffect(() => {
    if (phase === "playing" && !answered && TL > 0 && left <= 0) submit("timeout");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  function start() {
    if (!name.trim()) {
      nameRef.current?.focus();
      return;
    }
    setQi(0);
    setScore(0);
    setRight(0);
    setPicked(null);
    setLeft(TL);
    setPhase("playing");
  }

  function next() {
    if (qi < questions.length - 1) {
      setQi(qi + 1);
      setPicked(null);
      setLeft(TL);
    } else {
      setPhase("done");
    }
  }

  function restart() {
    setPhase("welcome");
    setPicked(null);
  }

  /* ---------------- welcome ---------------- */
  if (phase === "welcome") {
    const parts = [
      counts.mc && `${counts.mc} اختيار من متعدد`,
      counts.tf && `${counts.tf} صح/غلط`,
      counts.cc && `${counts.cc} أكمل الكود`,
    ].filter(Boolean);
    return (
      <section className="s">
        <div className="tag">LOGARITHM · QUIZ</div>
        <h1>{quiz.title}</h1>
        {quiz.description && <p>{quiz.description}</p>}
        <p>
          📌 {questions.length} سؤال ({parts.join(" · ")}){" "}
          {TL > 0 && <>· ⏱️ {TL} ثانية لكل سؤال </>}· ⭐ {totalPoints} نقطة
        </p>
        <p>اكتب اسمك وابدأ الاختبار. بالتوفيق! 💪</p>
        <input
          ref={nameRef}
          className="nm"
          placeholder="اكتب اسمك هنا"
          maxLength={30}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && start()}
        />
        <button className="btn" onClick={start}>
          ابدأ الاختبار 🚀
        </button>
      </section>
    );
  }

  /* ---------------- result ---------------- */
  if (phase === "done") {
    const msg =
      right >= questions.length * 0.85
        ? "ممتاز! شغل عالي 🔥"
        : right >= questions.length * 0.5
        ? "كويس جدًا، كمل تدريب 👍"
        : "راجع الدرس وجرب تاني 💪";
    return (
      <section className="s" style={{ textAlign: "center" }}>
        <div className="tag">النتيجة النهائية</div>
        <div className="who">{name}</div>
        <div className="big">{score}</div>
        <p>نقطة من {totalPoints}</p>
        <h2>
          {right} / {questions.length} إجابات صحيحة
        </h2>
        <h2>{msg}</h2>
        <p>📸 صوّر النتيجة وشاركها مع المدرس.</p>
        <button className="btn" onClick={restart}>
          العب تاني 🔁
        </button>
      </section>
    );
  }

  /* ---------------- playing ---------------- */
  const correctText =
    q.type === "tf" ? (q.answer ? "صح" : "غلط") : q.options[q.answer as number];
  const ok = isCorrect(picked);
  const optIsRight = (i: number) => q.type !== "tf" && q.answer === i;

  return (
    <section className="q">
      <div className="bar">
        <i style={{ width: `${(qi / questions.length) * 100}%` }} />
      </div>

      <div className="qtop">
        <span className="pill">
          {qi + 1} / {questions.length} · {LABEL[q.type]}
        </span>
        {TL > 0 && (
          <div className={`timer ${left <= 5 ? "low" : ""}`}>{Math.max(0, Math.ceil(left))}</div>
        )}
        <span className="pill">⭐ {score}</span>
      </div>
      {TL > 0 && (
        <div className="tbar">
          <i style={{ width: `${Math.max(0, (left / TL) * 100)}%` }} />
        </div>
      )}

      <div className="qcard">
        <h2>{q.question}</h2>
        {q.code && <pre>{q.code}</pre>}
      </div>

      {q.type === "tf" ? (
        <div className="ans two">
          {[
            { v: true, label: "صح", icon: "✔", cls: "t1" },
            { v: false, label: "غلط", icon: "✘", cls: "t0" },
          ].map((b) => (
            <button
              key={String(b.v)}
              className={`t ${b.cls} ${answered && q.answer === b.v ? "right" : ""} ${
                answered && picked === b.v && q.answer !== b.v ? "dim" : ""
              }`}
              disabled={answered}
              onClick={() => submit(b.v)}
            >
              <span className="sh">{b.icon}</span>
              <span className="tx">{b.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="ans">
          {q.options.map((o, i) => (
            <button
              key={i}
              className={`t t${i} ${answered && optIsRight(i) ? "right" : ""} ${
                answered && picked === i && !optIsRight(i) ? "dim" : ""
              }`}
              disabled={answered}
              onClick={() => submit(i)}
            >
              <span className="sh">{LETTERS[i]}</span>
              <span className="tx" style={isAscii(o) ? { direction: "ltr" } : undefined}>
                {o}
              </span>
            </button>
          ))}
        </div>
      )}

      {answered && (
        <div className={`fb ${ok ? "" : "r"}`}>
          <b>{picked === "timeout" ? "⏰ الوقت خلص" : ok ? "إجابة صحيحة! 🎉" : "مش الإجابة الصح"}</b>
          <span className="pts">{ok ? `+${pointsOf(q)}` : "0"} pts</span>
          <br />
          {q.explanation}
          {q.explanation && <br />}
          <small>
            الإجابة الصحيحة:{" "}
            {q.type !== "tf" && isAscii(correctText) ? (
              <span className="ltr">{correctText}</span>
            ) : (
              correctText
            )}
          </small>
        </div>
      )}

      <div className="qfoot">
        <button className="btn" onClick={next} disabled={!answered}>
          {qi === questions.length - 1 ? "عرض النتيجة 🏁" : "السؤال التالي ←"}
        </button>
        <button className="btn ghost" onClick={restart}>
          إعادة الاختبار ↻
        </button>
      </div>
    </section>
  );
}
