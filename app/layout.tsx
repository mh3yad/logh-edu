import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOGARITHM Academy",
  description: "كورسات برمجة بالعربي — شرح ومراجعة واختبارات",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <header className="site-header">
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div className="logo">L</div>
            <b>
              LOG<span>ARITHM</span>
            </b>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
