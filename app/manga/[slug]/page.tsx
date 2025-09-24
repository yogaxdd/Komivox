'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { comicAPI } from '@/lib/api';
import { ArrowLeft, Calendar, Eye, BookOpen, Star, Clock } from 'lucide-react';

interface ComicDetail {
  title: string;
  synopsis: string;
  chapters: Array<{
    chapter: string;
    link: string;
  }>;
}

export default function MangaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [comicDetail, setComicDetail] = useState<ComicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComicDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await comicAPI.getComicDetail(slug);
        setComicDetail(response);
      } catch (error) {
        console.error('Error fetching comic detail:', error);
        setError('Gagal memuat detail manga. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchComicDetail();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Memuat detail manga...</p>
        </div>
      </div>
    );
  }

  if (error || !comicDetail) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-white text-2xl font-bold mb-4">Manga Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-8">{error || 'Manga yang Anda cari tidak tersedia.'}</p>
          <Link
            href="/"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali ke Beranda
        </Link>

        {/* Comic Info */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {comicDetail.title || slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Update Terbaru</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Eye className="w-5 h-5 mr-2" />
              <span>{comicDetail.chapters.length} Chapter</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sinopsis</h3>
            <p className="text-gray-700 leading-relaxed">
              {comicDetail.synopsis || 'Sinopsis tidak tersedia untuk manga ini.'}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4">
            {comicDetail.chapters.length > 0 && (
              <Link
                href={`/read/${comicDetail.chapters[0].link.replace(/^\//, '').replace(/\/$/, '')}`}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200 flex items-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Baca Chapter Terbaru
              </Link>
            )}
            <button className="border-2 border-primary-500 text-primary-600 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200">
              Tambah ke Favorit
            </button>
          </div>
        </div>

        {/* Chapter List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="w-6 h-6 mr-3 text-primary-500" />
            Daftar Chapter
          </h2>
          
          <div className="grid gap-3">
            {comicDetail.chapters.map((chapter, index) => (
              <Link
                key={index}
                href={`/read/${chapter.link.replace(/^\//, '').replace(/\/$/, '')}`}
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-primary-50 rounded-lg transition-colors duration-200 group"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors duration-200">
                    <span className="text-primary-600 font-semibold text-sm">
                      {chapter.chapter.replace(/[^\d]/g, '') || (index + 1)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                      Chapter {chapter.chapter}
                    </h3>
                  </div>
                </div>
                <div className="text-primary-500 group-hover:text-primary-600 transition-colors duration-200">
                  <BookOpen className="w-5 h-5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
