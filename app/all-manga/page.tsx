'use client';

import { useState, useEffect } from 'react';
import { comicAPI } from '@/lib/api';
import ComicGrid from '@/components/ComicGrid';
import type { Comic } from '@/lib/api';

export default function AllMangaPage() {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);

  useEffect(() => {
    const fetchAllComics = async () => {
      try {
        setLoading(true);
        const api = comicAPI;
        const allComics = await api.getAllComics();
        setComics(allComics);
        setFilteredComics(allComics);
      } catch (err) {
        setError('Failed to fetch manga list');
        console.error('Error fetching all comics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllComics();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredComics(comics);
    } else {
      const filtered = comics.filter(comic =>
        comic.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredComics(filtered);
    }
  }, [searchTerm, comics]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading all manga...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-fox-gradient bg-clip-text text-transparent mb-4">
            All Manga
          </h1>
          <p className="text-gray-600 mb-6">
            Browse through our complete collection of {comics.length.toLocaleString()} manga titles
          </p>
          
          {/* Search Filter */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Filter manga by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white border-2 border-orange-200 rounded-lg focus:outline-none focus:border-orange-500 text-gray-800 placeholder-gray-500"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="text-center mb-6">
            <p className="text-gray-600">
              Showing {filteredComics.length.toLocaleString()} of {comics.length.toLocaleString()} manga
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* No Results */}
        {filteredComics.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No manga found</h3>
            <p className="text-gray-500 mb-4">
              No manga titles match your search for &quot;{searchTerm}&quot;
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Manga Grid */}
        {filteredComics.length > 0 && (
          <ComicGrid comics={filteredComics} title="All Manga" />
        )}
      </div>
    </div>
  );
}
