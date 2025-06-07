'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLanguage } from '@/hooks/useLanguage'
import { Heart, Eye, Calendar, MapPin, Star, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Ad {
  id: string
  title: string
  description?: string
  price?: number
  currency: string
  location?: string
  viewsCount: number
  isFeatured: boolean
  createdAt: string
  user: {
    name: string
    profile?: {
      rating: number
      totalReviews: number
    }
  }
  category: {
    nameAr: string
    slug: string
  }
  media: Array<{
    filePath: string
    isPrimary: boolean
  }>
  _count?: {
    reviews: number
    favorites: number
  }
}

export function FeaturedAdsSection() {
  const { getDirection } = useLanguage()
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isRTL = getDirection() === 'rtl'

  useEffect(() => {
    const fetchFeaturedAds = async () => {
      try {
        const response = await fetch('/api/ads?featured=true&limit=6')
        if (response.ok) {
          const data = await response.json()
          setAds(data.ads || [])
        }
      } catch (error) {
        console.error('Error fetching featured ads:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedAds()
  }, [])

  const formatPrice = (price?: number, currency = 'SYP') => {
    if (!price) return 'السعر عند الاستفسار'
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: currency === 'SYP' ? 'USD' : currency,
      maximumFractionDigits: 0,
    }).format(price / (currency === 'SYP' ? 1 : 1)) + (currency === 'SYP' ? ' ل.س' : '')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.RelativeTimeFormat('ar', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    )
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 text-orange-600 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            الإعلانات المميزة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            أفضل الإعلانات هذا الأسبوع
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            اكتشف مجموعة مختارة من أفضل الإعلانات المتاحة حالياً من البائعين المميزين
          </p>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {ads.map((ad) => {
            const primaryImage = ad.media.find(m => m.isPrimary) || ad.media[0]
            
            return (
              <div key={ad.id} className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  {primaryImage ? (
                    <Image
                      src={primaryImage.filePath}
                      alt={ad.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">لا توجد صورة</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Featured badge */}
                  {ad.isFeatured && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      مميز
                    </div>
                  )}
                  
                  {/* Quick actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button className="w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all">
                      <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
                    </button>
                  </div>

                  {/* Bottom overlay info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {ad.viewsCount}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {ad._count?.favorites || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      {ad.category.nameAr}
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      {formatDate(ad.createdAt)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {ad.title}
                  </h3>

                  {/* Location */}
                  {ad.location && (
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{ad.location}</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="text-2xl font-bold text-gray-900 mb-4">
                    {formatPrice(ad.price, ad.currency)}
                  </div>

                  {/* Seller info */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {ad.user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{ad.user.name}</div>
                        {ad.user.profile && (
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {ad.user.profile.rating.toFixed(1)}
                            <span>({ad.user.profile.totalReviews} تقييم)</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Link href={`/ads/${ad.id}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl group-hover:scale-105 transition-transform"
                      >
                        عرض
                        <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''} ml-1`} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/search">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
            >
              <span className="text-lg">عرض جميع الإعلانات</span>
              <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''} mr-2 group-hover:translate-x-1 transition-transform`} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
