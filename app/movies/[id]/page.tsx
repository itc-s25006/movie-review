import Link from 'next/link';
import { getMovieDetail } from '@/libs/microcms';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MovieDetailPage({ params }: Props) {
  const { id } = await params;
  const movie = await getMovieDetail(id);

  const genreName = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
  const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);

  return (
    <main style={{ maxWidth: '840px', margin: '0 auto', padding: '40px 20px' }}>
      <Link
        href="/movies"
        style={{
          display: 'inline-block',
          marginBottom: '24px',
          color: '#0070f3',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        ← 映画一覧に戻る
      </Link>

      <article
        style={{
          border: '1px solid #eaeaea',
          borderRadius: '12px',
          padding: '32px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        {/* ポスター画像 */}
          {movie.poster && (
            <img
              src={movie.poster.url}
              alt={movie.title}
              style={{
                width: '160px',
                maxWidth: '100%',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                objectFit: 'cover',
              }}
            />
          )}
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
              <span
                style={{
                  backgroundColor: '#f0f4ff',
                  color: '#0070f3',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                }}
              >
                {genreName}
              </span>
              <span style={{ color: '#666', fontSize: '14px' }}>{movie.releaseYear}年公開</span>
            </div>

            <h1 style={{ fontSize: '28px', marginBottom: '12px' }}>{movie.title}</h1>

            <div style={{ fontSize: '20px', color: '#f5a623', marginBottom: '8px' }}>
              {stars} <span style={{ color: '#333', fontSize: '16px' }}>({movie.rating}/5)</span>
            </div>

            <p style={{ color: '#555' }}>監督：{movie.director}</p>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '28px 0' }} />

        <section style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>あらすじ・概要</h2>
          <p style={{ lineHeight: '1.8', color: '#333' }}>{movie.summary}</p>
        </section>

        {movie.review && (
          <section
            style={{
              backgroundColor: '#f8f9fa',
              padding: '20px 24px',
              borderRadius: '10px',
              borderLeft: '4px solid #0070f3',
            }}
          >
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>レビュー・感想</h2>
            <p style={{ lineHeight: '1.9', color: '#222', whiteSpace: 'pre-wrap' }}>
              {movie.review}
            </p>
          </section>
        )}
      </article>
    </main>
  );
}