'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Search, Tag, TrendingUp, Heart, Zap, Sword, Smile, Star, Users, BookOpen } from 'lucide-react';

const genres = [
  { name: 'Action', icon: Sword, color: 'bg-red-500', description: 'Pertarungan seru dan aksi mendebarkan' },
  { name: 'Romance', icon: Heart, color: 'bg-pink-500', description: 'Kisah cinta yang menyentuh hati' },
  { name: 'Comedy', icon: Smile, color: 'bg-yellow-500', description: 'Cerita lucu yang menghibur' },
  { name: 'Fantasy', icon: Star, color: 'bg-purple-500', description: 'Dunia magis dan petualangan fantasi' },
  { name: 'Drama', icon: Users, color: 'bg-blue-500', description: 'Cerita mendalam tentang kehidupan' },
  { name: 'Slice of Life', icon: BookOpen, color: 'bg-green-500', description: 'Kehidupan sehari-hari yang realistis' },
  { name: 'Supernatural', icon: Zap, color: 'bg-indigo-500', description: 'Kekuatan supernatural dan misteri' },
  { name: 'Thriller', icon: TrendingUp, color: 'bg-gray-700', description: 'Ketegangan dan suspense' },
  { name: 'Horror', icon: Zap, color: 'bg-black', description: 'Cerita menakutkan dan menegangkan' },
  { name: 'Mystery', icon: Search, color: 'bg-gray-600', description: 'Teka-teki dan investigasi' },
  { name: 'Sci-Fi', icon: Star, color: 'bg-cyan-500', description: 'Teknologi masa depan dan luar angkasa' },
  { name: 'Historical', icon: BookOpen, color: 'bg-amber-600', description: 'Cerita berlatar masa lampau' },
];

export default function GenrePage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredGenres = genres.filter(genre =>
    genre.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = (query: string) => {
    // Redirect to search page or handle search
    window.location.href = `/?search=${encodeURIComponent(query)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Tag className="w-12 h-12 text-primary-500 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              🏷️ Genre Manga
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Jelajahi berbagai genre manga sesuai dengan selera Anda. Temukan cerita favorit dari kategori yang Anda sukai!
          </p>
        </div>

        {/* Search Genre */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Genre Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredGenres.map((genre, index) => {
            const IconComponent = genre.icon;
            return (
              <Link
                key={index}
                href={`/genre/${genre.name.toLowerCase()}`}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                <div className={`${genre.color} h-32 flex items-center justify-center relative overflow-hidden`}>
                  <IconComponent className="w-16 h-16 text-white group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">
                    {genre.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {genre.description}
                  </p>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary-500/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <IconComponent className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-semibold">Jelajahi {genre.name}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* No Results */}
        {filteredGenres.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🦊</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Genre tidak ditemukan</h3>
            <p className="text-gray-500">Coba cari dengan kata kunci yang berbeda</p>
          </div>
        )}

        {/* Popular Genres Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🔥 Genre Paling Populer</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.slice(0, 4).map((genre, index) => {
              const IconComponent = genre.icon;
              return (
                <Link
                  key={index}
                  href={`/genre/${genre.name.toLowerCase()}`}
                  className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className={`${genre.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{genre.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          Menampilkan {filteredGenres.length} dari {genres.length} genre yang tersedia
        </div>
      </main>

      <Footer />
    </div>
  );
}
