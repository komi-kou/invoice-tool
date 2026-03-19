import "./globals.css";

export const metadata = {
  title: "請求書メーカー Pro | 株式会社つなげる",
  description: "ブラウザ上で請求書・見積書・納品書をかんたん作成。リアルタイムプレビュー、PDF出力、インボイス制度対応。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
