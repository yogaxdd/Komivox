'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Comic } from '@/lib/api';

interface ComicCardProps {
  comic: Comic;
  showPopularity?: boolean;
}

export default function ComicCard({ comic, showPopularity = false }: ComicCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={comic.image}
          alt={comic.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Chapter Badge */}
        <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {comic.chapter}
        </div>

        {/* Popularity Badge */}
        {showPopularity && comic.popularity && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
            🔥 #{comic.popularity}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200 mb-2">
          {comic.title}
        </h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {comic.source && comic.source !== 'latest_as_popular' ? comic.source : 'Update Terbaru'}
          </span>
          <Link
            href={comic.link}
            className="text-primary-500 hover:text-primary-600 text-sm font-medium transition-colors duration-200"
          >
            Baca →
          </Link>
        </div>
      </div>

      {/* Hover overlay with action button */}
      <div className="absolute inset-0 bg-primary-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <Link
          href={comic.link}
          className="bg-white text-primary-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 transform translate-y-4 group-hover:translate-y-0"
        >
          Baca Sekarang
        </Link>
      </div>
    </div>
  );
}
