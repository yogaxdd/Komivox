'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { comicAPI } from '@/lib/api';
import { Maximize, Minimize, Home, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface ChapterImage {
  image: string;
}

export default function ReadPage() {
  const params = useParams();
  const router = useRouter();
  const segments = params.segments as string[];
  
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleImages, setVisibleImages] = useState<Set<number>>(new Set([0, 1, 2])); // Load first 3 images
  const [mangaSlug, setMangaSlug] = useState<string>('');
  const [currentChapter, setCurrentChapter] = useState<string>('');
  const [allChapters, setAllChapters] = useState<any[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const fetchChapterImages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const chapterPath = segments.join('/');
      
      // Extract manga slug and chapter from path
      const pathParts = chapterPath.split('-chapter-');
      if (pathParts.length === 2) {
        const slug = pathParts[0];
        const chapter = pathParts[1];
        setMangaSlug(slug);
        setCurrentChapter(chapter);
        
        // Fetch manga details to get all chapters
        try {
          const mangaDetail = await comicAPI.getComicDetail(slug);
          setAllChapters(mangaDetail.chapters);
        } catch (detailError) {
          console.error('Error fetching manga details:', detailError);
        }
      }
      
      const response = await comicAPI.getChapterImages(chapterPath);
      setImages(response.images);
    } catch (error) {
      console.error('Error fetching chapter images:', error);
      setError('Gagal memuat chapter. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  }, [segments]);

  useEffect(() => {
    if (segments && segments.length > 0) {
      fetchChapterImages();
    }
  }, [segments, fetchChapterImages]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for lazy loading
  const setupObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleImages(prev => {
              const newSet = new Set(prev);
              // Load current image and next 2 images
              for (let i = index; i < Math.min(index + 3, images.length); i++) {
                newSet.add(i);
              }
              return newSet;
            });
          }
        });
      },
      {
        rootMargin: '200px 0px', // Start loading 200px before image comes into view
        threshold: 0.1
      }
    );
  }, [images.length]);

  useEffect(() => {
    if (images.length > 0) {
      setupObserver();
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [images.length, setupObserver]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  // Find previous and next chapters
  const getCurrentChapterIndex = () => {
    return allChapters.findIndex(chapter => {
      const chapterNum = chapter.link.split('-chapter-')[1]?.replace('/', '');
      return chapterNum === currentChapter;
    });
  };

  const getPreviousChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    // For chapters, previous means higher chapter number (newer)
    if (currentIndex >= 0 && currentIndex < allChapters.length - 1) {
      return allChapters[currentIndex + 1];
    }
    return null;
  };

  const getNextChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    // For chapters, next means lower chapter number (older)
    if (currentIndex > 0) {
      return allChapters[currentIndex - 1];
    }
    return null;
  };

  const isFirstChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    return currentIndex === allChapters.length - 1; // Last in array = first chapter
  };

  const isLastChapter = () => {
    const currentIndex = getCurrentChapterIndex();
    return currentIndex === 0; // First in array = latest chapter
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Memuat chapter...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h2 className="text-white text-2xl font-bold mb-4">Oops! Terjadi Kesalahan</h2>
          <p className="text-gray-300 mb-6">{error}</p>
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

  if (images.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📖</div>
          <h2 className="text-white text-2xl font-bold mb-4">Chapter Tidak Ditemukan</h2>
          <p className="text-gray-300 mb-6">Chapter yang Anda cari tidak tersedia.</p>
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
    <div className={`min-h-screen bg-gray-900 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {!isFullscreen && <Header onSearch={handleSearch} />}
      
      <main className={`${isFullscreen ? 'h-screen overflow-y-auto scrollbar-hide' : 'py-8'}`}>
        {/* Navigation Bar */}
        {!isFullscreen && (
          <div className="max-w-4xl mx-auto px-4 mb-6">
            <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
              <Link
                href="/"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
              >
                <Home className="w-5 h-5 mr-2" />
                Beranda
              </Link>
              
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 text-sm">
                  {images.length} halaman
                </span>
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Reader - Full Scroll */}
        <div className={`${isFullscreen ? 'relative' : 'max-w-4xl mx-auto px-4'}`}>
          {/* Fullscreen Controls */}
          {isFullscreen && (
            <div className="fixed top-4 right-4 z-10 flex space-x-2">
              <button
                onClick={toggleFullscreen}
                className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors duration-200"
              >
                <Minimize className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* All Images in Vertical Scroll with Lazy Loading - No Gaps */}
          <div className="flex flex-col">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="relative w-full flex items-center justify-center bg-white"
                data-index={index}
                ref={(el) => {
                  if (el && observerRef.current && !visibleImages.has(index)) {
                    observerRef.current.observe(el);
                  }
                }}
              >
                {visibleImages.has(index) ? (
                  <Image
                    src={image}
                    alt={`Page ${index + 1}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-auto block"
                    priority={index < 3}
                    loading={index < 3 ? "eager" : "lazy"}
                    style={{ width: '100%', height: 'auto' }}
                  />
                ) : (
                  <div className="w-full min-h-[600px] flex flex-col items-center justify-center text-gray-400 bg-gray-800">
                    <div className="animate-pulse bg-gray-700 w-full h-96 mb-4"></div>
                    <p className="text-sm">Loading page {index + 1}...</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* End of Chapter Message with Navigation */}
          <div className="mt-8 text-center bg-gray-800 rounded-lg p-8">
            <div className="text-4xl mb-4">🎉</div>
            <h3 className="text-white text-xl font-bold mb-2">Selesai!</h3>
            <p className="text-gray-300 mb-6">Anda telah menyelesaikan chapter ini.</p>
            
            {/* Chapter Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              {/* Show Previous Chapter button (newer chapter) - always show if available */}
              {getPreviousChapter() && (
                <Link
                  href={`/read/${getPreviousChapter()?.link.replace(/^\//, '').replace(/\/$/, '')}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  ← Chapter Sebelumnya
                </Link>
              )}
              
              {/* Show Next Chapter button (older chapter) - always show if available */}
              {getNextChapter() && (
                <Link
                  href={`/read/${getNextChapter()?.link.replace(/^\//, '').replace(/\/$/, '')}`}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                >
                  Chapter Selanjutnya →
                </Link>
              )}
              
              {/* Special message for latest chapter */}
              {isLastChapter() && !getPreviousChapter() && (
                <div className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center">
                  🎊 Manga Tamat - Chapter Terakhir
                </div>
              )}
            </div>

            {/* Other Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/manga/${mangaSlug}`}
                className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Daftar Chapter
              </Link>
              <Link
                href="/"
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Kembali ke Beranda
              </Link>
              <button
                onClick={scrollToTop}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Scroll ke Atas
              </button>
            </div>
          </div>
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}
      </main>

{!isFullscreen && <Footer />}
    </div>
  );
}
