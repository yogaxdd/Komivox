'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Comic } from '@/lib/api';

interface ComicCardProps {
  comic: Comic;
  showPopularity?: boolean;
}

export default function ComicCard({ comic, showPopularity = false }: ComicCardProps) {
  // Fix malformed image URLs
  const sanitizeImageUrl = (url: string) => {
    if (!url) return '/placeholder-manga.jpg';
    
    // Check if URL is missing slash between domain and path
    const malformedPattern = /^(https?:\/\/[^\/]+)([^\/].*)/;
    const match = url.match(malformedPattern);
    
    if (match && !url.includes('/', 8)) { // 8 is after "https://"
      return `${match[1]}/${match[2]}`;
    }
    
    return url;
  };

  // Convert external komiku.org link to internal manga page
  const getInternalLink = (externalLink: string) => {
    if (!externalLink) return '/';
    
    // Extract slug from komiku.org URL
    // Example: https://komiku.org/manga/kaoru-hana-wa-rin-to-saku/ -> kaoru-hana-wa-rin-to-saku
    const match = externalLink.match(/\/manga\/([^\/]+)\/?$/);
    if (match) {
      return `/manga/${match[1]}`;
    }
    
    // Fallback: try to extract any slug-like pattern
    const slugMatch = externalLink.match(/\/([^\/]+)\/?$/);
    if (slugMatch) {
      return `/manga/${slugMatch[1]}`;
    }
    
    return '/';
  };

  return (
    <Link href={getInternalLink(comic.link)} className="block group">
      <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={sanitizeImageUrl(comic.image)}
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
          
          <div className="flex items-center justify-end">
            <span className="text-blue-500 group-hover:text-blue-600 text-xs font-medium transition-colors duration-200">
              Baca →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
