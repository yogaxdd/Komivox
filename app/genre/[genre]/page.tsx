'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import ComicGrid from '@/components/ComicGrid';
import Footer from '@/components/Footer';
import { comicAPI, Comic } from '@/lib/api';
import { ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

export default function GenreDetailPage() {
  const params = useParams();
  const genre = params.genre as string;
  
  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (genre) {
      fetchComicsByGenre();
    }
  }, [genre]);

  const fetchComicsByGenre = async () => {
    try {
      setIsLoading(true);
      // Fallback to popular comics since genre-specific API is not available
      const response = await comicAPI.getPopularComics(1);
      setComics(response.comics);
    } catch (error) {
      console.error('Error fetching comics by genre:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await comicAPI.searchComics(query);
      
      const searchComics: Comic[] = response.results.map(result => ({
        title: result.title,
        link: result.href,
        image: result.thumbnail,
        chapter: result.description,
      }));
      
      setComics(searchComics);
    } catch (error) {
      console.error('Error searching comics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const genreName = genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Genre';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/genre"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Daftar Genre
        </Link>

        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Tag className="w-12 h-12 text-primary-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Genre {genreName}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Koleksi manga dengan genre {genreName.toLowerCase()}. Temukan cerita yang sesuai dengan selera Anda!
          </p>
        </div>

        {/* Genre Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-primary-500 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center">
            <Tag className="w-4 h-4 mr-2" />
            {genreName}
          </div>
        </div>

        {/* Comics Grid */}
        <ComicGrid
          comics={comics}
          title={`Manga ${genreName}`}
          isLoading={isLoading}
        />

        {/* Coming Soon Notice */}
        {!isLoading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-8">
            <div className="text-center">
              <div className="text-4xl mb-2">🚧</div>
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Fitur Dalam Pengembangan</h3>
              <p className="text-yellow-700">
                Filter berdasarkan genre sedang dalam tahap pengembangan. 
                Saat ini menampilkan manga populer sebagai contoh.
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
