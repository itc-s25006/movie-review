import Link from 'next/link';
import { getMovies } from '@/libs/microcms';
import styles from './page.module.css';

export default async function MoviesPage() {
  const { contents: movies } = await getMovies();

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>映画レビュー一覧（全{movies.length}件）</h1>

      <div className={styles.grid}>
        {movies.map((movie) => {
          const genreName = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
          const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);

          return (
            <article key={movie.id} className={styles.card}>
              <div>
                <div className={styles.cardHeader}>
                  <span className={styles.genre}>{genreName}</span>
                  <span className={styles.year}>{movie.releaseYear}年公開</span>
                </div>
                <h2 className={styles.title}>{movie.title}</h2>
                <div className={styles.rating}>
                  {stars} ({movie.rating}/5)
                </div>
                <p className={styles.director}>監督：{movie.director}</p>
                <p className={styles.summary}>{movie.summary}</p>
              </div>

              <Link href={`/movies/${movie.id}`} className={styles.link}>
                感想・詳細を見る
              </Link>
            </article>
          );
        })}
      </div>
    </main>
  );
}