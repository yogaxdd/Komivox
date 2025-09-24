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
    <Link href={comic.link} className="block group">
      <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={comic.image}
            alt={comic.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Chapter Badge */}
          {comic.chapter && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {comic.chapter}
            </div>
          )}

          {/* Popularity Badge */}
          {showPopularity && comic.popularity && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
              🔥 #{comic.popularity}
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200 mb-2 text-sm leading-tight">
            {comic.title}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 truncate">
              {comic.source && comic.source !== 'latest_as_popular' ? comic.source : 'Update Terbaru'}
            </span>
            <span className="text-blue-500 group-hover:text-blue-600 text-xs font-medium transition-colors duration-200 ml-2">
              Baca →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
