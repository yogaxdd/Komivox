'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Eye, Star, BookOpen, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { comicAPI, ComicDetail } from '@/lib/api';

export default function MangaDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [comicDetail, setComicDetail] = useState<ComicDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComicDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const detail = await comicAPI.getComicDetail(slug);
      setComicDetail(detail);
    } catch (error) {
      console.error('Error fetching comic detail:', error);
      setError('Gagal memuat detail manga');
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (slug) {
      fetchComicDetail();
    }
  }, [slug, fetchComicDetail]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-1/3">
                <div className="bg-gray-300 aspect-[3/4] rounded-xl"></div>
              </div>
              <div className="w-full lg:w-2/3">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !comicDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🦊</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Manga Tidak Ditemukan</h1>
            <p className="text-gray-600 mb-6">{error || 'Manga yang Anda cari tidak tersedia'}</p>
            <Link
              href="/"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-200"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
        <Footer />
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Comic Cover - Placeholder since we don't have image in detail API */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gradient-to-br from-primary-100 to-primary-200 aspect-[3/4] rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BookOpen className="w-16 h-16 text-primary-500 mx-auto mb-4" />
                  <p className="text-primary-700 font-medium">Cover Manga</p>
                </div>
              </div>
            </div>

            {/* Comic Details */}
            <div className="w-full lg:w-2/3">
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
                    href={`/read${comicDetail.chapters[0].link}`}
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
          </div>
        </div>

        {/* Chapter List */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Daftar Chapter</h2>
          
          {comicDetail.chapters.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Belum ada chapter tersedia</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {comicDetail.chapters.map((chapter, index) => (
                <Link
                  key={index}
                  href={`/read/${chapter.link.replace(/^\//, '').replace(/\/$/, '')}`}
                  className="group flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4 group-hover:bg-primary-200 transition-colors duration-200">
                      <BookOpen className="w-5 h-5 text-primary-600" />
                    </div>
                    <span className="font-medium text-gray-900 group-hover:text-primary-700 transition-colors duration-200">
                      {chapter.chapter}
                    </span>
                  </div>
                  <div className="text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Baca →
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
