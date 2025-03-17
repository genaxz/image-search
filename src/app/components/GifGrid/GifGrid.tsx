'use client';
import React from 'react';
import Image from 'next/image';
import styles from './GifGrid.module.css';
import { Gif } from '../../core/interfaces/gif';
import { useSavedGifs } from '../context/SavedGifsContext';
import GifCore from '../GifCore/GifCore';
import { SavedIcon, UnsavedIcon } from './SaveIcons';

interface GifGridProps {
  gifs: Gif[];
  isLoading: boolean;
  lastGifElementRef: (node: HTMLDivElement | null) => void;
}

const GifGrid: React.FC<GifGridProps> = ({
  gifs,
  isLoading,
  lastGifElementRef,
}) => {
  const { saveGif, unsaveGif, isSaved } = useSavedGifs();

  const handleSaveToggle = (gif: Gif) => {
    if (isSaved(gif.id)) {
      unsaveGif(gif.id);
    } else {
      saveGif(gif);
    }
  };

  return (
    <div className={styles.gifGrid}>
      {gifs.map((gif, index) => (
        <div
          key={`${gif.id}-${index}`}
          className={styles.gifContainer}
          ref={index === gifs.length - 1 ? lastGifElementRef : null}
        >
          <Image
            src={gif.images.fixed_height.url}
            alt={gif.title}
            className={styles.gifItem}
            width={200}
            height={200}
            loading="lazy"
            unoptimized={true}
          />
          <button
            onClick={() => handleSaveToggle(gif)}
            className={`${styles.saveButton} ${
              isSaved(gif.id) ? styles.saved : ''
            }`}
          >
            {isSaved(gif.id) ? <SavedIcon /> : <UnsavedIcon />}
          </button>
        </div>
      ))}
      {isLoading &&
        Array.from({ length: 5 }).map((_, index) => (
          <GifCore key={`skeleton-${index}`} />
        ))}
    </div>
  );
};

export default GifGrid;
