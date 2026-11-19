import { getMovies } from '@/libs/microcms';
import MovieList from './MovieList';
import styles from './page.module.css';

export default async function MoviesPage() {
  const { contents: movies } = await getMovies();

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>映画レビュー一覧（全{movies.length}件）</h1>
      <MovieList movies={movies} />
    </main>
  );
}