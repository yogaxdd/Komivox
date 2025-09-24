'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ComicGrid from '@/components/ComicGrid';
import { comicAPI } from '@/lib/api';
import { Comic } from '@/lib/api';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [searchResults, setSearchResults] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle hydration by only setting query after component mounts
  useEffect(() => {
    setMounted(true);
    const urlQuery = searchParams.get('q') || '';
    setQuery(urlQuery);
  }, [searchParams]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await comicAPI.searchComics(searchQuery);
      
      console.log('Search API response:', response); // Debug log
      
      // Transform search results to match Comic interface
      const transformedResults = response.results.map((item: any) => {
        console.log('Search item:', item); // Debug each item
        return {
          title: item.title,
          slug: item.href.replace('/detail-komik/', '').replace('/', ''),
          image: item.thumbnail || item.image || '', // Use thumbnail field from API
          rating: item.rating || 0,
          status: item.status || '',
          type: item.type || '',
          popularity: item.popularity || 0,
          link: item.href,
          chapter: ''
        };
      });
      
      console.log('Transformed results:', transformedResults); // Debug transformed data
      setSearchResults(transformedResults);
    } catch (error) {
      console.error('Error searching comics:', error);
      setError('Gagal melakukan pencarian. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  // Don't render search-dependent content until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={performSearch} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pencarian Manga</h1>
            <p className="text-gray-600 mb-8">
              Gunakan kotak pencarian di atas untuk mencari manga favorit Anda
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={performSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {query && (
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hasil Pencarian: &quot;{query}&quot;
            </h1>
            <p className="text-gray-600">
              {isLoading ? 'Mencari...' : `Ditemukan ${searchResults.length} hasil`}
            </p>
          </div>
        )}

        {!query && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Pencarian Manga</h1>
            <p className="text-gray-600 mb-8">
              Gunakan kotak pencarian di atas untuk mencari manga favorit Anda
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div className="text-red-800">{error}</div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
          </div>
        )}

        {!isLoading && searchResults.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {searchResults.filter(comic => comic.title && comic.title.trim() !== '').map((comic, index) => (
              <a 
                key={`${comic.title}-${index}`} 
                href={`/manga/${comic.slug}`}
                className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 block"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={comic.image}
                    alt={comic.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {comic.type && (
                    <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {comic.type}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 mb-2">
                    {comic.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {typeof comic.rating === 'number' && comic.rating > 0 && (
                        <div className="flex items-center">
                          <span className="text-yellow-400 text-sm">⭐</span>
                          <span className="text-sm text-gray-600 ml-1">{comic.rating}</span>
                        </div>
                      )}
                    </div>
                    
                    <span className="text-primary-500 group-hover:text-primary-600 text-sm font-medium">
                      Baca →
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {!isLoading && query && (searchResults.length === 0 || searchResults.filter(comic => comic.title && comic.title.trim() !== '').length === 0) && !error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Tidak Ada Hasil Ditemukan
            </h2>
            <p className="text-gray-600 mb-8">
              Tidak ditemukan manga dengan kata kunci &quot;{query}&quot;. 
              Coba gunakan kata kunci yang berbeda.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
