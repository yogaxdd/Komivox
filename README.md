# 🦊 Komivox - Platform Baca Manga Online

Komivox adalah platform baca manga online modern yang dibangun dengan Next.js 14 dan Tailwind CSS. Terinspirasi dari kelicikan dan kecerdasan rubah, Komivox menyediakan pengalaman membaca manga yang menyenangkan dengan desain yang eye-catching dan user-friendly.

## ✨ Fitur Utama

- 📚 **Manga Terbaru**: Update manga terbaru setiap hari
- 🔥 **Manga Populer**: Koleksi manga paling populer
- 🔍 **Pencarian Cerdas**: Cari manga favorit dengan mudah
- 📱 **Responsive Design**: Optimal di semua perangkat
- 🎨 **UI Modern**: Desain orange theme yang menarik
- ⚡ **Fast Loading**: Performa optimal dengan Next.js 14

## 🚀 Teknologi yang Digunakan

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **API**: Komiku API Integration
- **Deployment**: Vercel Ready

## 🛠️ Instalasi & Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd komivox
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser**
   ```
   http://localhost:3000
   ```

## 📁 Struktur Proyek

```
komivox/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── ComicCard.tsx
│   ├── ComicGrid.tsx
│   └── Footer.tsx
├── lib/
│   └── api.ts
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary Orange**: `#f97316` (Tailwind orange-500)
- **Fox Orange**: `#ff6b35`
- **Dark Orange**: `#ea580c`
- **Light Orange**: `#fed7aa`

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights (600-800)
- **Body**: Regular weight (400-500)

## 🌐 API Integration

Komivox menggunakan API dari Komiku untuk mendapatkan data manga:

- **Latest Comics**: `/comic/terbaru`
- **Popular Comics**: `/comic/populer`
- **Search Comics**: `/comic/search?q={query}`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🚀 Deployment

Proyek ini siap untuk di-deploy ke Vercel:

1. Push ke GitHub repository
2. Connect repository ke Vercel
3. Deploy otomatis akan berjalan

## 🦊 Filosofi Komivox

**Rubah (🦊)** melambangkan:
- **Kelicikan**: Navigasi yang cerdas dan intuitif
- **Kecerdasan**: Fitur pencarian yang akurat
- **Playful**: Pengalaman yang menyenangkan

**Warna Orange (🟠)** melambangkan:
- **Energik**: Semangat membaca yang tinggi
- **Fun**: Pengalaman yang menghibur
- **Eye-catching**: Desain yang menarik perhatian

## 📄 License

MIT License - Bebas digunakan untuk proyek personal dan komersial.

## 🤝 Contributing

Kontribusi selalu diterima! Silakan buat pull request atau issue untuk saran dan perbaikan.

---

**Dibuat dengan ❤️ untuk para pecinta manga di Indonesia**
