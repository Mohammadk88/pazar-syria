'use client'

import { AdCard } from "@/components/ads/AdCard"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

interface Ad {
  id: string
  title: string
  price: number | null
  currency: string
  location: string | null
  adType: 'SALE' | 'RENT' | 'WANTED'
  createdAt: string
  viewsCount: number
  isFeatured: boolean
  category: {
    nameAr: string
    slug: string
  }
  user: {
    name: string
    profile: {
      rating: number
    } | null
  }
  media: Array<{
    filePath: string
    isPrimary: boolean
  }>
  _count: {
    favorites: number
    reviews: number
  }
}

export function FeaturedAdsSection() {
  const [featuredAds, setFeaturedAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedAds()
  }, [])

  const fetchFeaturedAds = async () => {
    try {
      const response = await fetch('/api/ads?featured=true&limit=4')
      const data = await response.json()
      setFeaturedAds(data.ads || [])
    } catch (error) {
      console.error('Error fetching featured ads:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = (id: string) => {
    console.log(`Toggle favorite for ad ${id}`)
    // TODO: Implement favorite functionality
  }

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الإعلانات المميزة...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              الإعلانات المميزة
            </h2>
            <p className="text-lg text-gray-600">
              اكتشف أفضل العروض والإعلانات المميزة
            </p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex">
            عرض المزيد
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredAds.map((ad) => (
            <AdCard
              key={ad.id}
              id={ad.id}
              title={ad.title}
              price={ad.price || 0}
              currency={ad.currency}
              location={ad.location || ''}
              imageUrl={ad.media.find(m => m.isPrimary)?.filePath || undefined}
              category={ad.category.nameAr}
              adType={ad.adType}
              createdAt={new Date(ad.createdAt)}
              views={ad.viewsCount}
              rating={ad.user.profile?.rating || undefined}
              reviewCount={ad._count.reviews}
              isPromoted={ad.isFeatured}
              onFavoriteToggle={() => handleFavoriteToggle(ad.id)}
            />
          ))}
        </div>

        {/* Show all featured ads button */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            عرض جميع الإعلانات المميزة
          </Button>
        </div>
      </div>
    </section>
  )
}
