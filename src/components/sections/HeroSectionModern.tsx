'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, MapPin, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'

const searchSuggestions = {
  ar: ['شقة في دمشق', 'سيارة للبيع', 'مكتب للإيجار', 'فيلا في حلب'],
  en: ['Apartment in Damascus', 'Car for sale', 'Office for rent', 'Villa in Aleppo'],
  tr: ['Şam\'da daire', 'Satılık araba', 'Kiralık ofis', 'Halep\'te villa'],
  fr: ['Appartement à Damas', 'Voiture à vendre', 'Bureau à louer', 'Villa à Alep'],
  ku: ['Apartman li Şamê', 'Otomobîl ji bo firotin', 'Ofîs ji bo kirê', 'Vîla li Helepê']
}

export function HeroSection() {
  const { getDirection } = useLanguage()
  const language = 'ar' // Default to Arabic for now
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const isRTL = getDirection() === 'rtl'

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (location) params.set('location', location)
    window.location.href = `/search?${params.toString()}`
  }

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Animated mesh gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Geometric patterns */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="m 40 0 l 0 40 l -40 0 Z" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center max-w-7xl">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8 text-white">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span className="text-sm font-medium">منصة الإعلانات الأولى في سوريا</span>
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        
        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
          <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            بازار سوريا
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed font-light">
          اكتشف آلاف الإعلانات في العقارات والسيارات في جميع أنحاء سوريا. ابحث، اعرض، اشتري، أو بيع بسهولة وأمان.
        </p>

        {/* Quick suggestions */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {searchSuggestions[language as keyof typeof searchSuggestions].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setSearchQuery(suggestion)}
              className="group px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/40"
            >
              <span className="group-hover:text-yellow-300 transition-colors">{suggestion}</span>
            </button>
          ))}
        </div>

        {/* Modern search bar */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors ${isRTL ? 'right-4' : 'left-4'}`} />
                <Input
                  placeholder="ابحث عن إعلانك المثالي..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`h-16 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-lg font-medium shadow-lg focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <div className="flex-1 relative group">
                <MapPin className={`absolute top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors ${isRTL ? 'right-4' : 'left-4'}`} />
                <Input
                  placeholder="اختر المدينة أو المنطقة..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`h-16 bg-white/90 backdrop-blur-sm border-0 rounded-2xl text-lg font-medium shadow-lg focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all ${isRTL ? 'pr-14 pl-4' : 'pl-14 pr-4'}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              
              <Button
                onClick={handleSearch}
                size="lg"
                className="h-16 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
              >
                <Search className="w-6 h-6 mx-2 group-hover:scale-110 transition-transform" />
                ابحث الآن
              </Button>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <Link href="/post-ad">
            <Button
              size="lg"
              className="h-16 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="text-lg">أضف إعلانك مجاناً</span>
              <ArrowRight className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/ads">
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-8 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 group"
            >
              <TrendingUp className="w-5 h-5 ml-3 group-hover:scale-110 transition-transform" />
              <span className="text-lg">تصفح الإعلانات</span>
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">10,000+</div>
            <div className="text-blue-200 text-lg">إعلان منشور</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">5,000+</div>
            <div className="text-blue-200 text-lg">عضو نشط</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">14</div>
            <div className="text-blue-200 text-lg">محافظة مغطاة</div>
          </div>
          <div className="text-center group">
            <div className="text-4xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">24/7</div>
            <div className="text-blue-200 text-lg">خدمة مستمرة</div>
          </div>
        </div>
      </div>
    </section>
  )
}

<style jsx>{`
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  .animate-blob {
    animation: blob 7s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`}</style>
