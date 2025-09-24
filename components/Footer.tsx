'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8">
                <Image
                  src="/logo-komivox.png"
                  alt="Komivox Logo"
                  width={32}
                  height={32}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-2xl font-bold bg-fox-gradient bg-clip-text text-transparent">
                Komivox
              </div>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Platform baca manga online terlengkap dengan ribuan judul manga dari berbagai genre. 
              Nikmati pengalaman membaca yang menyenangkan dengan update terbaru setiap hari.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors duration-200">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Menu Utama</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/terbaru" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Manga Terbaru
                </Link>
              </li>
              <li>
                <Link href="/populer" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Manga Populer
                </Link>
              </li>
              <li>
                <Link href="/genre" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Daftar Genre
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Genre Populer</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/genre/action" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Action
                </Link>
              </li>
              <li>
                <Link href="/genre/romance" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Romance
                </Link>
              </li>
              <li>
                <Link href="/genre/comedy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Comedy
                </Link>
              </li>
              <li>
                <Link href="/genre/fantasy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Fantasy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Komivox. Dibuat dengan <Heart className="w-4 h-4 text-red-500 inline mx-1" /> untuk para pecinta manga.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                Kebijakan Privasi
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                Syarat & Ketentuan
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                Kontak
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
