'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Movie } from '@/libs/microcms';
import styles from './page.module.css';

type Props = {
  movies: Movie[];
};

export default function MovieList({ movies }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('すべて');
  const [sortOrder, setSortOrder] = useState<'default' | 'rating'>('default');

  const genres = [
    'すべて',
    ...Array.from(
      new Set(
        movies
          .map((m) => (Array.isArray(m.genre) ? m.genre[0] : m.genre))
          .filter(Boolean)
      )
    ),
  ];

  const filteredMovies = movies
    .filter((movie) => {
      const genreName = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
      const matchesGenre = selectedGenre === 'すべて' || genreName === selectedGenre;

      const query = searchQuery.toLowerCase();
      const matchesQuery =
        movie.title.toLowerCase().includes(query) ||
        (movie.director && movie.director.toLowerCase().includes(query));

      return matchesGenre && matchesQuery;
    })
    .sort((a, b) => {
      if (sortOrder === 'rating') {
        return b.rating - a.rating;
      }
      return 0;
    });

  return (
    <>
      {/* 検索・フィルター操作エリア */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="映画タイトル・監督名で検索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '15px',
            }}
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'default' | 'rating')}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #ddd',
              fontSize: '15px',
              backgroundColor: '#fff',
              cursor: 'pointer',
            }}
          >
            <option value="default">新着・登録順</option>
            <option value="rating">評価が高い順（★）</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {genres.map((genre) => {
            const isSelected = selectedGenre === genre;
            return (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  border: isSelected ? '1px solid #0070f3' : '1px solid #ddd',
                  backgroundColor: isSelected ? '#0070f3' : '#fff',
                  color: isSelected ? '#fff' : '#333',
                  fontSize: '14px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  cursor: 'pointer',
                }}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

      <p style={{ marginBottom: '16px', color: '#555', fontSize: '14px' }}>
        該当件数：{filteredMovies.length}件
      </p>

      {filteredMovies.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          条件に一致する映画が見つかりませんでした。
        </p>
      ) : (
        <div className={styles.grid}>
          {filteredMovies.map((movie) => {
            const genreName = Array.isArray(movie.genre) ? movie.genre[0] : movie.genre;
            const stars = '★'.repeat(movie.rating) + '☆'.repeat(5 - movie.rating);

            return (
              <article key={movie.id} className={styles.card}>
                <div>
{/* ポスター画像エリア */}
                  <div
                    style={{
                      marginBottom: '14px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f4f5f7',
                      height: '180px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {movie.poster ? (
                      <img
                        src={movie.poster.url}
                        alt={movie.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <span style={{ color: '#999', fontSize: '13px' }}>No Image</span>
                    )}
                  </div>

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
      )}
    </>
  );
}