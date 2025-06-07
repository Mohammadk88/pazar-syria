'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Plus, 
  Edit3, 
  Eye, 
  Heart, 
  Package, 
  Settings,
  BarChart3,
  TrendingUp,
  Calendar
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface UserAd {
  id: string
  title: string
  price: number
  currency: string
  location: string
  adType: string
  isActive: boolean
  isFeatured: boolean
  viewsCount: number
  createdAt: string
  category: {
    name: string
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

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [ads, setAds] = useState<UserAd[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAds: 0,
    activeAds: 0,
    totalViews: 0,
    totalFavorites: 0
  })

  useEffect(() => {
    if (session) {
      fetchUserAds()
    }
  }, [session])

  const fetchUserAds = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/ads')
      if (response.ok) {
        const data = await response.json()
        setAds(data.ads)
        
        // Calculate stats
        const totalViews = data.ads.reduce((sum: number, ad: UserAd) => sum + ad.viewsCount, 0)
        const totalFavorites = data.ads.reduce((sum: number, ad: UserAd) => sum + ad._count.favorites, 0)
        
        setStats({
          totalAds: data.ads.length,
          activeAds: data.ads.filter((ad: UserAd) => ad.isActive).length,
          totalViews,
          totalFavorites
        })
      }
    } catch (error) {
      console.error('Error fetching user ads:', error)
    } finally {
      setLoading(false)
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="w-12 h-12 bg-sky-600 rounded-full flex items-center justify-center mr-4">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  مرحباً، {session.user?.name}
                </h1>
                <p className="text-gray-600">لوحة تحكم المستخدم</p>
              </div>
            </div>
            <Link href="/post-ad">
              <Button className="flex items-center">
                <Plus className="w-4 h-4 mr-2" />
                إضافة إعلان جديد
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="w-8 h-8 text-sky-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalAds}</p>
                  <p className="text-gray-600">إجمالي الإعلانات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.activeAds}</p>
                  <p className="text-gray-600">الإعلانات النشطة</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Eye className="w-8 h-8 text-blue-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                  <p className="text-gray-600">إجمالي المشاهدات</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="w-8 h-8 text-red-600" />
                <div className="mr-4">
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFavorites}</p>
                  <p className="text-gray-600">المفضلة</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ads Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                إعلاناتي
              </span>
              <Link href="/post-ad">
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  إضافة إعلان
                </Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">جاري تحميل الإعلانات...</p>
              </div>
            ) : ads.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد إعلانات</h3>
                <p className="text-gray-600 mb-4">ابدأ بإضافة إعلانك الأول</p>
                <Link href="/post-ad">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    إضافة إعلان جديد
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ads.map((ad) => (
                  <div key={ad.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex">
                        {ad.media?.[0] && (
                          <Image
                            src={ad.media[0].url}
                            alt={ad.title}
                            width={80}
                            height={80}
                            className="w-20 h-20 object-cover rounded-lg mr-4"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{ad.title}</h3>
                            <Badge variant={ad.isActive ? "default" : "secondary"}>
                              {ad.isActive ? 'نشط' : 'غير نشط'}
                            </Badge>
                            {ad.isFeatured && (
                              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                مميز
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-600 mb-2">{ad.category.name} • {ad.location}</p>
                          <p className="text-lg font-bold text-sky-600">
                            {formatPrice(ad.price, ad.currency)}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {ad.viewsCount} مشاهدة
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-4 h-4 mr-1" />
                              {ad._count.favorites} مفضلة
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {new Date(ad.createdAt).toLocaleDateString('ar')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/ads/${ad.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
