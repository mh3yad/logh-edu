export type QuestionType = "mc" | "tf" | "cc";

type Base = {
  /** نص السؤال */
  question: string;
  /** كود اختياري يظهر تحت السؤال */
  code?: string;
  /** شرح الإجابة (يظهر بعد الإجابة) */
  explanation?: string;
  /** نقاط السؤال (الافتراضي: points في الكويز أو 10) */
  points?: number;
};

/** اختيار من متعدد: answer = رقم الاختيار الصحيح (يبدأ من 0) */
export type MCQuestion = Base & {
  type: "mc";
  options: string[];
  answer: number;
};

/** صح/غلط: answer = true أو false */
export type TFQuestion = Base & {
  type: "tf";
  answer: boolean;
};

/** أكمل الكود: زي الاختيار من متعدد، والكود فيه ___ مكان الناقص */
export type CCQuestion = Base & {
  type: "cc";
  options: string[];
  answer: number;
};

export type Question = MCQuestion | TFQuestion | CCQuestion;

export type Quiz = {
  title: string;
  description?: string;
  /** الوقت بالثواني لكل سؤال (الافتراضي 30). 0 = بدون وقت */
  timePerQuestion?: number;
  /** نقاط كل سؤال (الافتراضي 10) */
  points?: number;
  questions: Question[];
};

export type Course = {
  slug: string;
  title: string;
  description?: string;
  icon?: string;
  order: number;
};

export type Lesson = {
  slug: string;
  courseSlug: string;
  title: string;
  description?: string;
  order: number;
  hasExplain: boolean;
  hasRevision: boolean;
  hasQuiz: boolean;
};

export type ContentFile =
  | { kind: "md"; content: string }
  | { kind: "html"; content: string };
