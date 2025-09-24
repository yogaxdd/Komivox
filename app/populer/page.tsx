'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ComicGrid from '@/components/ComicGrid';
import Footer from '@/components/Footer';
import { comicAPI, Comic } from '@/lib/api';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';

export default function PopulerPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchPopularComics(currentPage);
  }, [currentPage]);

  const fetchPopularComics = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await comicAPI.getPopularComics();
      setComics(response);
      // Since getPopularComics doesn't support pagination, set static values
      setTotalPages(1);
      setHasMore(false);
    } catch (error) {
      console.error('Error fetching popular comics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await comicAPI.searchComics(query);
      
      // Convert search results to Comic format
      const searchComics: Comic[] = response.results.map(result => ({
        title: result.title,
        link: result.href,
        image: result.thumbnail,
        chapter: result.description,
      }));
      
      setComics(searchComics);
      setCurrentPage(1);
      setTotalPages(1);
      setHasMore(false);
    } catch (error) {
      console.error('Error searching comics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-primary-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              🔥 Manga Populer
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manga paling populer dan paling banyak dibaca oleh para pecinta manga. Jangan sampai ketinggalan!
          </p>
        </div>

        {/* Trending Badge */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-2 rounded-full font-semibold text-sm flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Trending Sekarang
          </div>
        </div>

        {/* Comics Grid */}
        <ComicGrid
          comics={comics}
          title={`Manga Populer - Halaman ${currentPage}`}
          showPopularity={true}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {!isLoading && comics.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center mt-12 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Sebelumnya
            </button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === pageNum
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || !hasMore}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Popular Stats */}
        {!isLoading && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Statistik Popularitas</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500 mb-2">{comics.length}</div>
                <div className="text-gray-600">Manga Populer</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-500 mb-2">500K+</div>
                <div className="text-gray-600">Total Pembaca</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">Daily</div>
                <div className="text-gray-600">Update Ranking</div>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Menampilkan {comics.length} manga populer dari halaman {currentPage}
            {totalPages > 1 && ` dari ${totalPages} halaman`}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
