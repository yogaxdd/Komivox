'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ComicGrid from '@/components/ComicGrid';
import Footer from '@/components/Footer';
import { comicAPI, Comic, SearchResult } from '@/lib/api';

export default function Home() {
  const [latestComics, setLatestComics] = useState<Comic[]>([]);
  const [popularComics, setPopularComics] = useState<Comic[]>([]);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreComics, setHasMoreComics] = useState(true);

  useEffect(() => {
    fetchLatestComics();
    fetchPopularComics();
  }, []);

  const fetchLatestComics = async () => {
    try {
      setIsLoadingLatest(true);
      const response = await comicAPI.getRealTimeComics(20, true);
      setLatestComics(response.comics);
      setScrollOffset(response.comics.length);
    } catch (error) {
      console.error('Error fetching latest comics:', error);
    } finally {
      setIsLoadingLatest(false);
    }
  };

  const loadMoreComics = useCallback(async () => {
    if (isLoadingMore || !hasMoreComics) return;
    
    try {
      setIsLoadingMore(true);
      const response = await comicAPI.getScrollComics(scrollOffset, 20);
      
      if (response.comics.length > 0) {
        setLatestComics(prev => [...prev, ...response.comics]);
        setScrollOffset(prev => prev + response.comics.length);
        setHasMoreComics(response.pagination.has_more);
      } else {
        setHasMoreComics(false);
      }
    } catch (error) {
      console.error('Error loading more comics:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [scrollOffset, isLoadingMore, hasMoreComics]);

  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery) return; // Don't load more during search
      
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.offsetHeight;
      
      if (scrollTop + windowHeight >= docHeight - 1000) {
        loadMoreComics();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreComics, searchQuery]);

  const fetchPopularComics = async () => {
    try {
      setIsLoadingPopular(true);
      const response = await comicAPI.getPopularComics(1);
      setPopularComics(response.comics.slice(0, 10)); // Show first 10
    } catch (error) {
      console.error('Error fetching popular comics:', error);
    } finally {
      setIsLoadingPopular(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsSearching(true);
      setSearchQuery(query);
      const response = await comicAPI.searchComics(query);
      
      // Convert search results to Comic format for display
      const searchComics: Comic[] = response.results.map(result => ({
        title: result.title,
        link: result.href,
        image: result.thumbnail,
        chapter: result.description,
      }));
      
      setSearchResults(response.results);
    } catch (error) {
      console.error('Error searching comics:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <main className="min-h-screen">
      <Header onSearch={handleSearch} />
      
      {searchQuery ? (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">
                Hasil Pencarian: &quot;{searchQuery}&quot;
              </h2>
              <button
                onClick={clearSearch}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                Kembali ke Beranda
              </button>
            </div>
            
            {isSearching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-300 aspect-[3/4] rounded-xl mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🦊</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada hasil ditemukan</h3>
                <p className="text-gray-500">Coba cari dengan kata kunci yang berbeda</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {searchResults.map((result, index) => (
                  <div key={index} className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={result.thumbnail}
                        alt={result.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {result.type}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                        {result.title}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {result.genre}
                        </span>
                        <Link
                          href={`/manga/${result.href.replace('/detail-komik/', '').replace('/', '')}`}
                          className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
                        >
                          Baca →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      ) : (
        <>
          <Hero />
          
          <ComicGrid
            comics={latestComics}
            title="Manga Terbaru"
            isLoading={isLoadingLatest}
          />
          
          {isLoadingMore && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-gray-600">Memuat lebih banyak manga...</span>
            </div>
          )}
          
          {!hasMoreComics && latestComics.length > 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🦊</div>
              <p className="text-gray-500">Kamu sudah melihat semua manga terbaru!</p>
            </div>
          )}
          
          <ComicGrid
            comics={popularComics}
            title="Manga Populer"
            showPopularity={true}
            isLoading={isLoadingPopular}
          />
        </>
      )}
      
      <Footer />
    </main>
  );
}
