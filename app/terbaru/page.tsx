'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import ComicGrid from '@/components/ComicGrid';
import Footer from '@/components/Footer';
import { comicAPI, Comic } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TerbaruPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchLatestComics(currentPage);
  }, [currentPage]);

  const fetchLatestComics = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await comicAPI.getLatestComics(page);
      setComics(response.comics);
      setTotalPages(Math.ceil(response.pagination.total / response.pagination.per_page));
      setHasMore(response.pagination.has_more);
    } catch (error) {
      console.error('Error fetching latest comics:', error);
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            📚 Manga Terbaru
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Temukan manga terbaru yang baru saja dirilis. Update setiap hari dengan chapter-chapter terbaru!
          </p>
        </div>

        {/* Comics Grid */}
        <ComicGrid
          comics={comics}
          title={`Manga Terbaru - Halaman ${currentPage}`}
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

        {/* Stats */}
        {!isLoading && (
          <div className="text-center mt-8 text-gray-500 text-sm">
            Menampilkan {comics.length} manga dari halaman {currentPage}
            {totalPages > 1 && ` dari ${totalPages} halaman`}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
