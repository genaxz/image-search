export interface Gif {
  id: string;
  title: string;
  images: {
    original: GifImage;
    fixed_height: GifImage;
    fixed_width: GifImage;
  };
  user?: {
    username: string;
    display_name: string;
    avatar_url: string;
  };
}

interface GifImage {
  url: string;
  width: string;
  height: string;
  size?: string;
  mp4?: string;
  webp?: string;
}
