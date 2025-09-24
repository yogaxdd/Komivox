import axios from 'axios';

const API_BASE_URL = 'https://www.sankavollerei.com';

export interface Comic {
  title: string;
  link: string;
  image: string;
  chapter: string;
  rating?: string | null;
  genre?: string | null;
  status?: string | null;
  source?: string;
  selector_used?: string;
  fetched_at?: string;
  popularity?: number;
}

export interface SearchResult {
  title: string;
  href: string;
  thumbnail: string;
  description: string;
  type?: string;
  genre?: string;
}

export interface Chapter {
  chapter: string;
  link: string;
  title?: string;
  date?: string;
}

export interface ChapterImage {
  image: string;
}

export interface SearchResponse {
  results: SearchResult[];
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

export interface ComicResponse {
  creator?: string;
  comics: Comic[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    has_more: boolean;
  };
}

export interface ChapterResponse {
  images: ChapterImage[];
}

export interface ComicDetail {
  creator: string;
  title: string;
  synopsis: string;
  chapters: Chapter[];
}

export interface ChapterImages {
  creator: string;
  images: string[];
}

class ComicAPI {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Komivox/1.0.0',
      },
    });

    // Add retry interceptor for network errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const config = error.config;
        if (!config) return Promise.reject(error);

        // Only retry on network errors (ECONNRESET, timeout, etc.)
        const isNetworkError = error.code === 'ECONNRESET' || 
                              error.code === 'ETIMEDOUT' ||
                              error.message?.includes('timeout') ||
                              error.message?.includes('Network Error');

        if (!isNetworkError) return Promise.reject(error);

        config.retryCount = config.retryCount || 0;
        const maxRetries = 2;
        
        if (config.retryCount >= maxRetries) {
          return Promise.reject(error);
        }

        config.retryCount += 1;
        const delay = Math.pow(2, config.retryCount) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
        
        return this.axiosInstance(config);
      }
    );
  }

  async getLatestComics(page: number = 1): Promise<ComicResponse> {
    try {
      const response = await this.axiosInstance.get(`/comic/terbaru?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching latest comics:', error);
      throw new Error('Failed to fetch latest comics');
    }
  }

  async getPopularComics(page: number = 1): Promise<ComicResponse> {
    try {
      const response = await this.axiosInstance.get(`/comic/populer?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular comics:', error);
      throw new Error('Failed to fetch popular comics');
    }
  }

  async searchComics(query: string): Promise<SearchResponse> {
    try {
      const response = await this.axiosInstance.get(`/comic/search?q=${encodeURIComponent(query)}`);
      // Transform the API response to match our SearchResponse interface
      const apiData = response.data;
      return {
        results: apiData.data.map((item: any) => ({
          title: item.title,
          href: item.slug || item.href.replace('/detail-komik/', '').replace(/\/$/, ''),
          thumbnail: item.thumbnail,
          description: item.description,
          type: item.type,
          genre: item.genre
        }))
      };
    } catch (error) {
      console.error('Error searching comics:', error);
      throw new Error('Failed to search comics');
    }
  }

  async getComicDetail(slug: string): Promise<ComicDetail> {
    try {
      const response = await this.axiosInstance.get(`/comic/comic/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching comic detail:', error);
      throw new Error('Failed to fetch comic detail');
    }
  }

  async getChapterImages(chapterSegment: string): Promise<ChapterImages> {
    try {
      const response = await this.axiosInstance.get(`/comic/chapter/${chapterSegment}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching chapter images:', error);
      throw new Error('Failed to fetch chapter images');
    }
  }

  async getRealTimeComics(count: number = 48, fresh: boolean = false): Promise<ComicResponse> {
    try {
      const response = await this.axiosInstance.get(`/comic/realtime?count=${count}&fresh=${fresh}`);
      return {
        creator: response.data.creator,
        comics: response.data.comics,
        pagination: {
          current_page: 1,
          per_page: count,
          total: response.data.metadata.total_fetched,
          has_more: false
        }
      };
    } catch (error) {
      console.error('Error fetching real-time comics:', error);
      throw new Error('Failed to fetch real-time comics');
    }
  }

  async getScrollComics(offset: number = 0, batchSize: number = 20): Promise<ComicResponse> {
    try {
      const response = await this.axiosInstance.get(`/comic/scroll?offset=${offset}&batch_size=${batchSize}`);
      return {
        creator: response.data.creator,
        comics: response.data.comics,
        pagination: {
          current_page: Math.floor(offset / batchSize) + 1,
          per_page: batchSize,
          total: response.data.scroll_info.returned_count,
          has_more: response.data.scroll_info.has_more
        }
      };
    } catch (error) {
      console.error('Error fetching scroll comics:', error);
      throw new Error('Failed to fetch scroll comics');
    }
  }
}

export const comicAPI = new ComicAPI();
