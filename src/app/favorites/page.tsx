'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Heart, 
  MapPin, 
  Eye, 
  Star,
  X
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface FavoriteAd {
  id: string
  adId: string
  createdAt: string
  ad: {
    id: string
    title: string
    price: number
    currency: string
    location: string
    adType: string
    isActive: boolean
    viewsCount: number
    createdAt: string
    category: {
      name: string
    }
    user: {
      name: string
      profile: {
        rating: number
        type: string
      }
    }
    media: Array<{
      url: string
      isPrimary: boolean
    }>
    _count: {
      favorites: number
      reviews: number
    }
  }
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [favorites, setFavorites] = useState<FavoriteAd[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session) {
      fetchFavorites()
    }
  }, [session])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/favorites')
      if (response.ok) {
        const data = await response.json()
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (adId: string) => {
    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adId }),
      })

      if (response.ok) {
        setFavorites(prev => prev.filter(fav => fav.adId !== adId))
      }
    } catch (error) {
      console.error('Error removing favorite:', error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('ar-SY', {
      style: 'currency',
      currency: currency === 'SYP' ? 'SYP' : 'USD',
      minimumFractionDigits: 0,
    }).format(price)
  }

  // Redirect to login if not authenticated
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Heart className="w-8 h-8 text-red-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">المفضلة</h1>
              <p className="text-gray-600">الإعلانات التي أضفتها إلى المفضلة</p>
            </div>
          </div>
        </div>

        {/* Favorites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-600" />
                إعلاناتي المفضلة ({favorites.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">جاري تحميل المفضلة...</p>
              </div>
            ) : favorites.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات مفضلة</h3>
                <p className="text-gray-600 mb-4">ابدأ بإضافة إعلانات إلى المفضلة</p>
                <Link href="/">
                  <Button>
                    تصفح الإعلانات
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((favorite) => {
                  const ad = favorite.ad
                  return (
                    <div key={favorite.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      {/* Image */}
                      <div className="relative">
                        {ad.media?.[0] ? (
                          <Image
                            src={ad.media[0].url}
                            alt={ad.title}
                            width={300}
                            height={200}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">لا توجد صورة</span>
                          </div>
                        )}
                        
                        {/* Remove favorite button */}
                        <button
                          onClick={() => removeFavorite(ad.id)}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                        
                        {/* Status badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {ad.adType === 'SALE' && (
                            <Badge className="bg-green-600">للبيع</Badge>
                          )}
                          {ad.adType === 'RENT' && (
                            <Badge className="bg-blue-600">للإيجار</Badge>
                          )}
                          {!ad.isActive && (
                            <Badge variant="secondary">غير نشط</Badge>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {ad.title}
                        </h3>
                        
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{ad.location}</span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-sky-600">
                            {formatPrice(ad.price, ad.currency)}
                          </span>
                          <Badge variant="outline">{ad.category.name}</Badge>
                        </div>
                        
                        {/* Seller info */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center">
                            <span>{ad.user.name}</span>
                            {ad.user.profile?.rating > 0 && (
                              <div className="flex items-center mr-2">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="mr-1">{ad.user.profile.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{ad.viewsCount}</span>
                          </div>
                        </div>
                        
                        {/* Action buttons */}
                        <Link href={`/ads/${ad.id}`}>
                          <Button className="w-full">
                            عرض التفاصيل
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
