'use client';

import { Comic } from '@/lib/api';
import ComicCard from './ComicCard';

interface ComicGridProps {
  comics: Comic[];
  title: string;
  showPopularity?: boolean;
  isLoading?: boolean;
}

export default function ComicGrid({ comics, title, showPopularity = false, isLoading = false }: ComicGridProps) {
  if (isLoading) {
    return (
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <span className="mr-3">{showPopularity ? '🔥' : '📚'}</span>
            {title}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 aspect-[3/4] rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <span className="mr-3">{showPopularity ? '🔥' : '📚'}</span>
            {title}
          </h2>
          <div className="hidden md:block text-sm text-gray-500">
            Menampilkan {comics.length} manga
          </div>
        </div>
        
        {comics.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak ada manga ditemukan</h3>
            <p className="text-gray-500">Coba cari dengan kata kunci yang berbeda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {comics.map((comic, index) => (
              <ComicCard 
                key={`${comic.title}-${index}`} 
                comic={comic} 
                showPopularity={showPopularity}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
