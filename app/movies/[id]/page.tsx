import Link from 'next/link';
import { getMovieDetail } from '@/libs/microcms';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function MovieDetailPage({ params }: Props) {
  // URLの末尾（/movies/〇〇 の 〇〇 部分）を取り出す
  const { id } = await params;
  // そのIDの映画データだけをmicroCMSから取得する
  const movie = await getMovieDetail(id);

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
      <Link href="/movies" style={{ color: '#0070f3', textDecoration: 'none' }}>
        ← 一覧に戻る
      </Link>

      <article style={{ marginTop: '24px' }}>
        <h1>{movie.title}</h1>
        <p>評価：{movie.rating}</p>
        <p style={{ lineHeight: '1.8', marginTop: '20px' }}>{movie.review}</p>
      </article>
    </main>
  );
}