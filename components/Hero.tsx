'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Star, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  
  const slogans = [
    "Dunia Manga dalam Genggaman 🦊",
    "Baca Manga Terbaru Setiap Hari 📚",
    "Ribuan Cerita Menanti Anda ✨",
    "Petualangan Tak Terbatas Dimulai 🚀"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slogans.length]);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-orange-50 to-red-50">
        <div 
          className="absolute inset-0 opacity-40" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>📖</div>
      <div className="absolute top-32 right-20 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>⭐</div>
      <div className="absolute bottom-32 left-20 text-3xl animate-bounce" style={{ animationDelay: '2s' }}>🎭</div>
      <div className="absolute bottom-20 right-10 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🌟</div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Hero Content */}
        <div className="mb-8">
          <div className="w-48 h-48 mx-auto mb-6 fox-bounce">
            <Image
              src="/logo-komivox.png"
              alt="Komivox Logo"
              width={192}
              height={192}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-fox-gradient bg-clip-text text-transparent">
              Komivox
            </span>
          </h1>
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-gray-700 font-medium transition-all duration-500">
              {slogans[currentSlogan]}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/terbaru"
            className="group bg-primary-500 hover:bg-primary-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center"
          >
            Mulai Baca Sekarang
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <Link
            href="/populer"
            className="group border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105"
          >
            Manga Populer
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">6,297+</div>
            <div className="text-gray-600">Judul Manga</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">-</div>
            <div className="text-gray-600">Pembaca Aktif</div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-primary-500" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">Daily</div>
            <div className="text-gray-600">Update Terbaru</div>
          </div>
        </div>

      </div>
    </section>
  );
}
