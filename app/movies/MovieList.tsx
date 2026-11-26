'use client';

import { useState, useRef } from 'react';
import type { Movie } from '@/libs/microcms';
import styles from './page.module.css';

type Props = {
  movies: Movie[];
};

export default function MovieList({ movies }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('すべて');
  const [sortOrder, setSortOrder] = useState<'default' | 'rating'>('default');

  // 現在選択されている映画（nullなら一覧表示、映画データが入れば詳細スライド表示）
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  // スワイプ検知用の座標記録
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

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

  // 指が画面に触れた瞬間
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  // 指が画面から離れた瞬間（横スワイプ判定）
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // 縦スクロールより横の動きが大きく、かつ60px以上スワイプした場合に反応
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 60) {
      if (deltaX > 0 && selectedMovie) {
        // 右へスワイプ → 一覧へ戻る
        setSelectedMovie(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (deltaX < 0 && !selectedMovie && filteredMovies.length > 0) {
        // 左へスワイプ → 先頭の映画の詳細を開く
        setSelectedMovie(filteredMovies[0]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    touchStartX.current = null;
    touchStartY.current = null;
  };

  // 詳細画面が開いているかどうかのフラグ
  const isDetailOpen = selectedMovie !== null;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        overflow: 'hidden',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* 2画面分の横長コンテナ（0% と -50% をスライドして切り替える） */}
      <div
        style={{
          display: 'flex',
          width: '200%',
          transform: isDetailOpen ? 'translateX(-50%)' : 'translateX(0%)',
          transition: 'transform 0.32s cubic-bezier(0.25, 1, 0.5, 1)',
          alignItems: 'flex-start',
        }}
      >
        {/* ================= 1画面目：映画一覧 ================= */}
        <div style={{ width: '50%', paddingRight: '8px', boxSizing: 'border-box' }}>
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
                  minWidth: '200px',
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

          <p style={{ marginBottom: '16px', color: '#555', fontSize: '13px' }}>
            該当件数：{filteredMovies.length}件（タップまたは左スワイプで詳細）
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
                  <article
                    key={movie.id}
                    className={styles.card}
                    onClick={() => {
                      setSelectedMovie(movie);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div>
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

                    <span className={styles.link} style={{ display: 'inline-block', marginTop: '12px' }}>
                      感想・詳細を見る →
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* ================= 2画面目：映画詳細（スライド表示） ================= */}
        <div style={{ width: '50%', paddingLeft: '8px', boxSizing: 'border-box' }}>
          {selectedMovie && (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <button
                  onClick={() => setSelectedMovie(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0070f3',
                    fontWeight: 'bold',
                    fontSize: '15px',
                    cursor: 'pointer',
                    padding: '6px 0',
                  }}
                >
                  ← 一覧に戻る
                </button>
                <span style={{ fontSize: '12px', color: '#888' }}>右へスワイプでも戻れます →</span>
              </div>

              <article
                style={{
                  border: '1px solid #eaeaea',
                  borderRadius: '12px',
                  padding: '24px',
                  backgroundColor: '#fff',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  {selectedMovie.poster && (
                    <img
                      src={selectedMovie.poster.url}
                      alt={selectedMovie.title}
                      style={{
                        width: '150px',
                        maxWidth: '100%',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                        objectFit: 'cover',
                      }}
                    />
                  )}

                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <span
                        style={{
                          backgroundColor: '#f0f4ff',
                          color: '#0070f3',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                        }}
                      >
                        {Array.isArray(selectedMovie.genre)
                          ? selectedMovie.genre[0]
                          : selectedMovie.genre}
                      </span>
                      <span style={{ color: '#666', fontSize: '13px' }}>
                        {selectedMovie.releaseYear}年公開
                      </span>
                    </div>

                    <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>{selectedMovie.title}</h2>

                    <div style={{ fontSize: '18px', color: '#f5a623', marginBottom: '8px' }}>
                      {'★'.repeat(selectedMovie.rating) + '☆'.repeat(5 - selectedMovie.rating)}{' '}
                      <span style={{ color: '#333', fontSize: '15px' }}>({selectedMovie.rating}/5)</span>
                    </div>

                    <p style={{ color: '#555', fontSize: '14px' }}>監督：{selectedMovie.director}</p>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '24px 0' }} />

                <section style={{ marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>あらすじ・概要</h3>
                  <p style={{ lineHeight: '1.8', color: '#333', fontSize: '15px' }}>
                    {selectedMovie.summary}
                  </p>
                </section>

                {selectedMovie.review && (
                  <section
                    style={{
                      backgroundColor: '#f8f9fa',
                      padding: '18px 20px',
                      borderRadius: '10px',
                      borderLeft: '4px solid #0070f3',
                    }}
                  >
                    <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>レビュー・感想</h3>
                    <p style={{ lineHeight: '1.9', color: '#222', whiteSpace: 'pre-wrap', fontSize: '15px' }}>
                      {selectedMovie.review}
                    </p>
                  </section>
                )}
              </article>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}