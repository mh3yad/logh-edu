import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ContentFile } from "@/lib/types";

/** بيعرض ملف الشرح/المراجعة: Markdown (.md) أو صفحة HTML كاملة (.html) */
export default function ContentView({ file, title }: { file: ContentFile; title: string }) {
  if (file.kind === "html") {
    return (
      <iframe
        className="frame"
        title={title}
        srcDoc={file.content}
        sandbox="allow-scripts allow-same-origin"
      />
    );
  }
  return (
    <article className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{file.content}</ReactMarkdown>
    </article>
  );
}
