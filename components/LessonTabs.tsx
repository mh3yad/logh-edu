"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  base: string;
  hasExplain: boolean;
  hasRevision: boolean;
  hasQuiz: boolean;
};

export default function LessonTabs({ base, hasExplain, hasRevision, hasQuiz }: Props) {
  const pathname = usePathname();
  const tabs = [
    { key: "explain", label: "📖 الشرح", on: hasExplain },
    { key: "revision", label: "🔁 المراجعة", on: hasRevision },
    { key: "quiz", label: "📝 الكويز", on: hasQuiz },
  ];
  return (
    <nav className="tabs">
      {tabs.map((t) => {
        const href = `${base}/${t.key}`;
        const active = pathname === href;
        return (
          <Link
            key={t.key}
            href={href}
            className={`tab ${active ? "active" : ""} ${t.on ? "" : "off"}`}
            aria-disabled={!t.on}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
