import { createClient } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});
export type Movie = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  rating: number;
  genre: string | string[];
  releaseYear: number;
  director: string;
  summary: string;
  review: string;
  poster?: {
    url: string;
    height: number;
    width: number;
  };
};

// 映画一覧を取得する関数
export const getMovies = async () => {
  const data = await client.getList<Movie>({
    endpoint: 'movie', // ← ここを 'movie' に修正！
    queries: { limit: 100 },
  });
  return data;
};

// 映画詳細を1件取得する関数
export const getMovieDetail = async (contentId: string) => {
  const data = await client.getListDetail<Movie>({
    endpoint: 'movie', // ← ここも 'movie' に修正！
    contentId,
  });
  return data;
};
