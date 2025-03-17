import { Gif } from '../interfaces/gif';

const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const BASE_URL = 'https://api.giphy.com/v1/gifs';

interface GiphyResponse {
  data: Gif[];
  pagination: {
    total_count: number;
    count: number;
    offset: number;
  };
  meta: {
    status: number;
    msg: string;
    response_id: string;
  };
}

class GiphyApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GiphyApiError';
  }
}

function sanitizeGifs(gifs: Gif[]): Gif[] {
  const uniqueGifs = new Map<string, Gif>();
  gifs.forEach((gif) => {
    if (!uniqueGifs.has(gif.id)) {
      uniqueGifs.set(gif.id, gif);
    }
  });
  return Array.from(uniqueGifs.values());
}

async function fetchFromGiphy(
  endpoint: string,
  params: Record<string, string>
): Promise<GiphyResponse> {
  if (!API_KEY) {
    throw new Error('GIPHY API key is not set');
  }

  const queryParams = new URLSearchParams({ api_key: API_KEY, ...params });
  const url = `${BASE_URL}/${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new GiphyApiError(`HTTP error! status: ${response.status}`);
    }

    const data: GiphyResponse = await response.json();

    if (data.meta.status !== 200) {
      throw new GiphyApiError(`API error: ${data.meta.msg}`);
    }

    // Sanitize the GIFs to remove duplicates
    data.data = sanitizeGifs(data.data);

    // Update the pagination count to reflect the actual number of unique GIFs
    data.pagination.count = data.data.length;

    return data;
  } catch (error) {
    console.error('Error fetching from Giphy:', error);
    if (error instanceof GiphyApiError) {
      throw error;
    }
    throw new Error('Failed to fetch GIFs. Please try again later.');
  }
}

export async function fetchTrendingGifs(
  limit: number = 25,
  offset: number = 0
): Promise<GiphyResponse> {
  return await fetchFromGiphy('trending', {
    limit: limit.toString(),
    offset: offset.toString(),
  });
}

export async function searchGifs(
  searchTerm: string,
  limit: number = 25,
  offset: number = 0
): Promise<GiphyResponse> {
  return await fetchFromGiphy('search', {
    q: searchTerm,
    limit: limit.toString(),
    offset: offset.toString(),
  });
}
