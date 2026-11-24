import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'CINEMA LOG | 映画レビュー＆感想記録',
  description: '観た映画のあらすじ・評価・感想をまとめたレビューサイトです。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafafa',
          color: '#222',
        }}
      >
        {/* 全ページ共通ヘッダー */}
        <header
          style={{
            backgroundColor: '#111827',
            color: '#fff',
            padding: '16px 24px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div
            style={{
              maxWidth: '1080px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Link
              href="/movies"
              style={{
                color: '#fff',
                textDecoration: 'none',
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>🎬</span>
              <span>CINEMA LOG</span>
            </Link>

            <nav>
              <Link
                href="/movies"
                style={{
                  color: '#d1d5db',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                作品一覧
              </Link>
            </nav>
          </div>
        </header>

        {/* 各ページの中身がここに入る */}
        <div style={{ flex: 1 }}>{children}</div>

        {/* 全ページ共通フッター */}
        <footer
          style={{
            backgroundColor: '#111827',
            color: '#9ca3af',
            textAlign: 'center',
            padding: '24px 16px',
            marginTop: '60px',
            fontSize: '13px',
          }}
        >
          <p style={{ margin: 0 }}>© 2026 CINEMA LOG - Movie Review Site</p>
        </footer>
      </body>
    </html>
  );
}