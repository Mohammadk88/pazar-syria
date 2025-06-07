'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Plus, Search } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'

export function CTASection() {
  const { getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'

  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-300 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full blur-3xl"></div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="2" fill="white"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center">
          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            ابدأ رحلتك معنا اليوم
          </h2>
          
          <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed">
            انضم إلى آلاف المستخدمين الذين يثقون في منصتنا لبيع وشراء العقارات والسيارات في جميع أنحاء سوريا
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link href="/post-ad">
              <Button
                size="lg"
                className="h-16 px-10 bg-white text-blue-600 hover:bg-gray-50 font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
              >
                <Plus className="w-6 h-6 ml-3 group-hover:rotate-90 transition-transform duration-300" />
                أضف إعلانك مجاناً
              </Button>
            </Link>
            
            <Link href="/search">
              <Button
                size="lg"
                variant="outline"
                className="h-16 px-10 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-bold text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105 group"
              >
                <Search className="w-6 h-6 ml-3 group-hover:scale-110 transition-transform duration-300" />
                تصفح الإعلانات
              </Button>
            </Link>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">إضافة مجانية</h3>
              <p className="text-blue-100">أضف إعلانك مجاناً بدون رسوم خفية</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">بحث متقدم</h3>
              <p className="text-blue-100">فلترة دقيقة للعثور على ما تبحث عنه</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4">
                <ArrowLeft className={`w-8 h-8 text-white ${isRTL ? 'rotate-180' : ''}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">تواصل مباشر</h3>
              <p className="text-blue-100">تواصل مباشر مع البائعين والمشترين</p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-8 border-t border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-blue-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span>آمن ومضمون</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>خدمة عملاء 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span>أكثر من 25,000 إعلان</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
