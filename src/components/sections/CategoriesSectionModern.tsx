'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage } from '@/hooks/useLanguage'
import { Building2, Car, ArrowRight, TrendingUp } from 'lucide-react'

interface Category {
  id: string
  nameAr: string
  nameEn: string
  nameTr: string
  nameFr: string
  nameKu: string
  slug: string
  icon?: string
  _count?: {
    ads: number
  }
}

const categoryIcons = {
  'real-estate': Building2,
  'cars': Car,
}

const categoryColors = {
  'real-estate': 'from-blue-500 to-indigo-600',
  'cars': 'from-green-500 to-emerald-600',
}

export function CategoriesSection() {
  const { getDirection } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isRTL = getDirection() === 'rtl'

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data)
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-lg animate-pulse">
                <div className="w-16 h-16 bg-gray-200 rounded-2xl mb-6"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            الأقسام الرئيسية
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            استكشف الفئات المتاحة
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اختر من مجموعة واسعة من الفئات المتخصصة للعثور على ما تبحث عنه بسرعة وسهولة
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category) => {
            const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Building2
            const gradientClass = categoryColors[category.slug as keyof typeof categoryColors] || 'from-gray-500 to-gray-600'
            
            return (
              <Link key={category.id} href={`/search?category=${category.slug}`}>
                <div className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-r ${gradientClass} rounded-full blur-3xl`}></div>
                    <div className={`absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-r ${gradientClass} rounded-full blur-2xl`}></div>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${gradientClass} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {category.nameAr}
                    </h3>
                    
                    <p className="text-gray-600 mb-6 line-clamp-2">
                      {category.slug === 'real-estate' 
                        ? 'اكتشف مجموعة واسعة من العقارات: شقق، فلل، مكاتب، ومحلات تجارية في جميع أنحاء سوريا'
                        : 'تصفح آلاف السيارات المستعملة والجديدة من جميع الأنواع والموديلات بأفضل الأسعار'
                      }
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">
                          {category._count?.ads || 0}
                        </span> إعلان متاح
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        إعلانات جديدة يومياً
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform">
                      <span className="text-lg font-semibold text-blue-600 group-hover:text-blue-700">
                        تصفح الإعلانات
                      </span>
                      <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${gradientClass} rounded-xl group-hover:scale-110 transition-transform`}>
                        <ArrowRight className={`w-5 h-5 text-white ${isRTL ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-4 border border-gray-200/50">
            <span className="text-gray-600">لم تجد ما تبحث عنه؟</span>
            <Link href="/post-ad">
              <button className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-4 decoration-2 hover:decoration-blue-700 transition-colors">
                أضف إعلانك الآن
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
