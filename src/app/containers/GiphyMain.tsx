'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import styles from '../page.module.css';
import { fetchTrendingGifs, searchGifs } from '../core/services/api';
import SearchGifs from '../components/SearchGif/SearchGifs';
import { Gif } from '../core/interfaces/gif';
import GifGrid from '../components/GifGrid/GifGrid';
import { debounce } from '../core/services/debounce';

const GIFS_PER_PAGE = 25;

export default function GiphyMain() {
  const [searchTerm, setSearchTerm] = useState('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastGifElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchGifs();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchGifs = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = searchTerm
        ? await searchGifs(searchTerm, GIFS_PER_PAGE, offset)
        : await fetchTrendingGifs(GIFS_PER_PAGE, offset);

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setGifs((prevGifs) => [...prevGifs, ...response.data]);
        setOffset((prevOffset) => prevOffset + GIFS_PER_PAGE);
      }
    } catch (error) {
      setError('Error fetching GIFs. Please try again later.');
      console.error('Error fetching GIFs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, offset, isLoading, hasMore]);

  useEffect(() => {
    setGifs([]);
    setOffset(0);
    setHasMore(true);
    fetchGifs();
  }, [searchTerm]);

  const handleSearchTermChange = debounce((term: string) => {
    setSearchTerm(term);
  }, 600);

  return (
    <div className={styles.container}>
      <h1 className={styles.appTitle}>GIF Search</h1>
      <SearchGifs setSearchTerm={handleSearchTermChange} />
      {error && (
        <div className={styles.error} role="alert" aria-live="assertive">
          {error}
        </div>
      )}
      <GifGrid
        gifs={gifs}
        isLoading={isLoading}
        lastGifElementRef={lastGifElementRef}
      />
      {isLoading && (
        <div className={styles.loader} aria-live="polite">
          Loading more GIFs...
        </div>
      )}
      {!hasMore && (
        <div className={styles.noMore} role="status" aria-live="polite">
          No more GIFs to load
        </div>
      )}
    </div>
  );
}
