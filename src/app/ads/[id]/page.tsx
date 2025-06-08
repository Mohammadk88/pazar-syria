'use client'

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Heart, 
  Share2, 
  Flag, 
  MapPin, 
  Calendar, 
  Eye, 
  Phone, 
  MessageCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  User,
  Home,
  Car,
  Bed,
  Bath,
  Calendar as CalendarIcon,
  Ruler,
  Settings,
  Fuel,
  Gauge,
  Palette,
  Play,
  Maximize,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/ui/star-rating"
import { AdCard } from "@/components/ads/AdCard"
import { ReviewsSection } from "@/components/reviews/ReviewsSection"
import { formatPrice, formatDate } from "@/lib/utils"
import { useLanguage } from "@/hooks/useLanguage"
import { LoadingOverlay } from "@/components/ui/loading"

interface PropertyDetails {
  propertyType: string
  area?: number
  bedrooms?: number
  bathrooms?: number
  floor?: number
  totalFloors?: number
  buildYear?: number
  hasGarage: boolean
  hasGarden: boolean
  hasElevator: boolean
  hasSecurity: boolean
  hasPool: boolean
  hasBalcony: boolean
  furnished?: string
  heatingType?: string
  features: string[]
}

interface CarDetails {
  brand: string
  model: string
  year: number
  mileage?: number
  fuelType: string
  transmission: string
  engineSize?: number
  horsePower?: number
  color?: string
  bodyType: string
  drivetrain?: string
  hasAirConditioning: boolean
  hasLeatherSeats: boolean
  hasSunroof: boolean
  hasNavigationSystem: boolean
  hasBluetoothConnectivity: boolean
  hasParkingSensors: boolean
  hasBackupCamera: boolean
  features: string[]
}

interface AdData {
  id: string
  title: string
  description?: string
  price?: number
  currency: string
  location?: string
  adType: string
  condition?: string
  createdAt: string
  viewsCount: number
  isFeatured: boolean
  contactPhone?: string
  contactWhatsapp?: string
  contactEmail?: string
  features?: string[]
  category: {
    nameAr: string
    nameEn: string
    slug: string
  }
  user: {
    id: string
    name: string
    avatar?: string
    profile: {
      type: string
      companyName?: string
      location?: string
      rating: number
      totalReviews: number
    }
  }
  media: Array<{
    id: string
    filePath: string
    fileType: string
    isPrimary: boolean
    sortOrder: number
  }>
  propertyDetails?: PropertyDetails
  carDetails?: CarDetails
}

export default function AdDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [adData, setAdData] = useState<AdData | null>(null)
  const [similarAds, setSimilarAds] = useState<AdData[]>([])

  // Fetch similar ads
  const fetchSimilarAds = useCallback(async (categorySlug: string, currentAdId: string) => {
    try {
      const response = await fetch(`/api/ads?category=${categorySlug}&limit=3&exclude=${currentAdId}`)
      if (response.ok) {
        const data = await response.json()
        setSimilarAds(data.ads || [])
      }
    } catch (error) {
      console.error('Error fetching similar ads:', error)
    }
  }, [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showFullScreenGallery, setShowFullScreenGallery] = useState(false)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [messageText, setMessageText] = useState('')
  const [sendingMessage, setSendingMessage] = useState(false)

  // Send message handler
  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    
    setSendingMessage(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: adData?.user.id,
          adId: adData?.id,
          content: messageText
        })
      })
      
      if (response.ok) {
        setMessageText('')
        setShowMessageModal(false)
        alert('تم إرسال الرسالة بنجاح!')
      } else {
        alert('فشل في إرسال الرسالة. يرجى المحاولة مرة أخرى.')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('حدث خطأ أثناء إرسال الرسالة')
    } finally {
      setSendingMessage(false)
    }
  }

  // Helper functions
  const getCurrentImageUrl = () => {
    if (!adData?.media || adData.media.length === 0) {
      return '/placeholder-ad.jpg'
    }
    return adData.media[currentImageIndex]?.filePath || '/placeholder-ad.jpg'
  }

  const getCurrentVideo = () => {
    if (!adData?.media || adData.media.length === 0) return null
    const currentMedia = adData.media[currentImageIndex]
    return currentMedia?.fileType === 'VIDEO' ? currentMedia : null
  }

  const nextImage = () => {
    if (!adData?.media) return
    setCurrentImageIndex((prev) => (prev + 1) % adData.media!.length)
  }

  const prevImage = () => {
    if (!adData?.media) return
    setCurrentImageIndex((prev) => (prev - 1 + adData.media!.length) % adData.media!.length)
  }

  // Handle async params
  useEffect(() => {
    const handleParams = async () => {
      try {
        const { id } = await params
        // Fetch ad data
        const response = await fetch(`/api/ads/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch ad')
        }
        const data = await response.json()
        setAdData(data)
        
        // Fetch similar ads
        if (data.category?.slug) {
          fetchSimilarAds(data.category.slug, id)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'حدث خطأ أثناء تحميل الإعلان')
      } finally {
        setLoading(false)
      }
    }
    handleParams()
  }, [params, fetchSimilarAds])

  if (loading) {
    return <LoadingOverlay isLoading={true} />
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-2">خطأ</h1>
          <p className="text-gray-600">{error}</p>
          <Button asChild className="mt-4">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </Card>
      </div>
    )
  }

  if (!adData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h1 className="text-xl font-semibold text-gray-600 mb-2">الإعلان غير موجود</h1>
          <p className="text-gray-500">لم يتم العثور على الإعلان المطلوب</p>
          <Button asChild className="mt-4">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-sky-600 hover:text-sky-800">
              الرئيسية
            </Link>
            <span className="text-gray-400">/</span>
            <Link href="/ads" className="text-sky-600 hover:text-sky-800">
              الإعلانات
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-600">{adData.category.nameAr}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card>
              <CardContent className="p-0">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg group cursor-pointer">
                  {getCurrentVideo() ? (
                    <div 
                      className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center relative overflow-hidden"
                      onClick={() => {
                        setVideoError(false)
                        setShowVideoModal(true)
                      }}
                    >
                      {/* Video thumbnail/preview */}
                      <video
                        src={getCurrentVideo()?.filePath}
                        className="absolute inset-0 w-full h-full object-cover opacity-50"
                        muted
                        preload="metadata"
                        onError={() => console.log('Video preview failed')}
                      />
                      
                      {/* Play overlay */}
                      <div className="relative z-10 text-center text-white">
                        <div className="bg-black/50 rounded-full p-6 mb-4 backdrop-blur-sm">
                          <Play className="w-12 h-12 mx-auto text-white" />
                        </div>
                        <p className="text-lg font-semibold mb-2">تشغيل الفيديو</p>
                        <p className="text-sm opacity-75">اضغط للتشغيل بالحجم الكامل</p>
                      </div>
                      
                      {/* Video badge */}
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-medium">
                        فيديو
                      </div>
                    </div>
                  ) : (
                    <Image
                      src={getCurrentImageUrl()}
                      alt={adData.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  
                  {/* Full Screen Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
                    onClick={() => setShowFullScreenGallery(true)}
                  >
                    <Maximize className="w-4 h-4" />
                  </Button>
                  
                  {/* Video Play Button if video exists */}
                  {getCurrentVideo() && (
                    <Button
                      variant="ghost"
                      size="lg"
                      className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-black/50 text-white hover:bg-black/70"
                      onClick={() => {
                        setVideoError(false)
                        setShowVideoModal(true)
                      }}
                    >
                      <Play className="w-8 h-8" />
                    </Button>
                  )}
                  
                  {/* Navigation Arrows */}
                  {(adData.media?.length || 0) > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-4' : 'left-4'} bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={prevImage}
                      >
                        {isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-4' : 'right-4'} bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity`}
                        onClick={nextImage}
                      >
                        {isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </Button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {adData.media?.length || 0}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {adData.isFeatured && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        مُميز
                      </Badge>
                    )}
                    <Badge variant={adData.adType === "SALE" ? "default" : "secondary"}>
                      {adData.adType === "SALE" ? "للبيع" : "للإيجار"}
                    </Badge>
                    {adData.condition && (
                      <Badge variant="outline" className="bg-white/90">
                        {adData.condition === 'NEW' ? 'جديد' : 
                         adData.condition === 'LIKE_NEW' ? 'كالجديد' :
                         adData.condition === 'GOOD' ? 'جيد' :
                         adData.condition === 'ACCEPTABLE' ? 'مقبول' : 'مستعمل'}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Thumbnail Gallery */}
                {(adData.media?.length || 0) > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                      {adData.media?.map((media, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            index === currentImageIndex ? 'border-sky-500 scale-105' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {media.fileType === 'VIDEO' ? (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Play className="w-6 h-6 text-gray-500" />
                              <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                                فيديو
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={media.filePath}
                              alt={`صورة ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Full Screen Gallery Modal */}
            {showFullScreenGallery && (
              <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                  onClick={() => setShowFullScreenGallery(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={getCurrentImageUrl()}
                    alt={adData.title}
                    fill
                    className="object-contain"
                  />
                  
                  {/* Navigation in full screen */}
                  {(adData.media?.length || 0) > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={prevImage}
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={nextImage}
                      >
                        <ChevronRight className="w-8 h-8" />
                      </Button>
                    </>
                  )}
                  
                  {/* Counter in full screen */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
                    {currentImageIndex + 1} / {adData.media?.length || 0}
                  </div>
                </div>
              </div>
            )}

            {/* Video Modal */}
            {showVideoModal && getCurrentVideo() && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
                  onClick={() => setShowVideoModal(false)}
                >
                  <X className="w-6 h-6" />
                </Button>
                
                <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center">
                  <video
                    src={getCurrentVideo()?.filePath}
                    controls
                    autoPlay
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onLoadStart={() => {
                      console.log('Video loading...')
                      setVideoError(false)
                    }}
                    onError={(e) => {
                      console.error('Video error:', e)
                      setVideoError(true)
                    }}
                    poster="/placeholder-ad.jpg"
                  >
                    <div className="text-white text-center p-8">
                      <p className="text-lg">متصفحك لا يدعم تشغيل الفيديو</p>
                      <a 
                        href={getCurrentVideo()?.filePath} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 underline"
                      >
                        تحميل الفيديو
                      </a>
                    </div>
                  </video>
                  
                  {/* Video error message */}
                  {videoError && (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white text-center p-8">
                      <div>
                        <div className="text-6xl mb-4">⚠️</div>
                        <p className="text-lg mb-2">فشل في تحميل الفيديو</p>
                        <p className="text-sm opacity-75 mb-4">تحقق من اتصال الإنترنت أو جرب لاحقاً</p>
                        <a 
                          href={getCurrentVideo()?.filePath} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-block bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700 transition-colors"
                        >
                          تحميل الفيديو مباشرة
                        </a>
                      </div>
                    </div>
                  )}
                  
                  {/* Video info overlay */}
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
                    <div className="text-sm font-medium">{adData.title}</div>
                    <div className="text-xs opacity-75">فيديو {currentImageIndex + 1} من {adData.media?.length || 0}</div>
                  </div>
                  
                  {/* Navigation buttons if multiple media */}
                  {(adData.media?.length || 0) > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={() => {
                          prevImage()
                          // If new item is not a video, close modal
                          setTimeout(() => {
                            if (!getCurrentVideo()) {
                              setShowVideoModal(false)
                            }
                          }, 100)
                        }}
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="lg"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20"
                        onClick={() => {
                          nextImage()
                          // If new item is not a video, close modal
                          setTimeout(() => {
                            if (!getCurrentVideo()) {
                              setShowVideoModal(false)
                            }
                          }, 100)
                        }}
                      >
                        <ChevronRight className="w-8 h-8" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Ad Details */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Title and Actions */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {adData.title}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {adData.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(adData.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1" />
                          {adData.viewsCount} مشاهدة
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsFavorite(!isFavorite)}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="bg-sky-50 p-4 rounded-lg">
                    <div className="text-3xl font-bold text-sky-600">
                      {formatPrice(adData.price, adData.currency)}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">الوصف</h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {adData.description}
                    </div>
                  </div>

                  {/* Property Details - Like Sahibinden */}
                  {adData.propertyDetails && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Home className="w-5 h-5 mr-2" />
                        تفاصيل العقار
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Home className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">نوع العقار</span>
                          </div>
                          <div className="font-semibold">{adData.propertyDetails.propertyType}</div>
                        </div>
                        
                        {adData.propertyDetails.area && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Ruler className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">المساحة</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.area} م²</div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.bedrooms && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Bed className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">غرف النوم</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.bedrooms}</div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.bathrooms && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Bath className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">الحمامات</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.bathrooms}</div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.floor && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Settings className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">الطابق</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.floor}</div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.buildYear && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">سنة البناء</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.buildYear}</div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.furnished && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Settings className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">الأثاث</span>
                            </div>
                            <div className="font-semibold">
                              {adData.propertyDetails.furnished === 'FURNISHED' ? 'مفروش' : 
                               adData.propertyDetails.furnished === 'SEMI_FURNISHED' ? 'نصف مفروش' : 'غير مفروش'}
                            </div>
                          </div>
                        )}
                        
                        {adData.propertyDetails.heatingType && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Settings className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">نوع التدفئة</span>
                            </div>
                            <div className="font-semibold">{adData.propertyDetails.heatingType}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Property Features */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">المرافق</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { key: 'hasGarage', label: 'موقف سيارة', value: adData.propertyDetails.hasGarage },
                            { key: 'hasGarden', label: 'حديقة', value: adData.propertyDetails.hasGarden },
                            { key: 'hasElevator', label: 'مصعد', value: adData.propertyDetails.hasElevator },
                            { key: 'hasSecurity', label: 'أمان', value: adData.propertyDetails.hasSecurity },
                            { key: 'hasPool', label: 'مسبح', value: adData.propertyDetails.hasPool },
                            { key: 'hasBalcony', label: 'بلكونة', value: adData.propertyDetails.hasBalcony }
                          ].map(feature => (
                            <div key={feature.key} className={`flex items-center p-2 rounded ${feature.value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                              <Star className={`w-4 h-4 mr-2 ${feature.value ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className="text-sm">{feature.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Car Details - Like Sahibinden */}
                  {adData.carDetails && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Car className="w-5 h-5 mr-2" />
                        تفاصيل السيارة
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Car className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">الماركة</span>
                          </div>
                          <div className="font-semibold">{adData.carDetails.brand}</div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Settings className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">الموديل</span>
                          </div>
                          <div className="font-semibold">{adData.carDetails.model}</div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CalendarIcon className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">سنة الصنع</span>
                          </div>
                          <div className="font-semibold">{adData.carDetails.year}</div>
                        </div>
                        
                        {adData.carDetails.mileage && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Gauge className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">المسافة المقطوعة</span>
                            </div>
                            <div className="font-semibold">{Number(adData.carDetails.mileage || 0).toLocaleString('ar-SA')} كم</div>
                          </div>
                        )}
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Fuel className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">نوع الوقود</span>
                          </div>
                          <div className="font-semibold">{adData.carDetails.fuelType}</div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center mb-2">
                            <Settings className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">ناقل الحركة</span>
                          </div>
                          <div className="font-semibold">{adData.carDetails.transmission}</div>
                        </div>
                        
                        {adData.carDetails.engineSize && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Settings className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">سعة المحرك</span>
                            </div>
                            <div className="font-semibold">{adData.carDetails.engineSize}L</div>
                          </div>
                        )}
                        
                        {adData.carDetails.color && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-2">
                              <Palette className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">اللون</span>
                            </div>
                            <div className="font-semibold">{adData.carDetails.color}</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Car Features */}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">المرافق</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { key: 'hasAirConditioning', label: 'مكيف', value: adData.carDetails.hasAirConditioning },
                            { key: 'hasLeatherSeats', label: 'مقاعد جلد', value: adData.carDetails.hasLeatherSeats },
                            { key: 'hasSunroof', label: 'فتحة سقف', value: adData.carDetails.hasSunroof },
                            { key: 'hasNavigationSystem', label: 'نظام ملاحة', value: adData.carDetails.hasNavigationSystem },
                            { key: 'hasBluetoothConnectivity', label: 'بلوتوث', value: adData.carDetails.hasBluetoothConnectivity },
                            { key: 'hasParkingSensors', label: 'حساسات', value: adData.carDetails.hasParkingSensors },
                            { key: 'hasBackupCamera', label: 'كاميرا خلفية', value: adData.carDetails.hasBackupCamera }
                          ].map(feature => (
                            <div key={feature.key} className={`flex items-center p-2 rounded ${feature.value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                              <Star className={`w-4 h-4 mr-2 ${feature.value ? 'text-green-500' : 'text-gray-300'}`} />
                              <span className="text-sm">{feature.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {adData.features && adData.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3">المميزات</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {adData.features.map((feature: string, index: number) => (
                          <div key={index} className="flex items-center text-sm">
                            <Star className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <ReviewsSection
              sellerId={adData.user.id}
              reviews={[]}
              averageRating={adData.user.profile.rating}
              totalReviews={adData.user.profile.totalReviews}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  معلومات البائع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {adData.user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-semibold">{adData.user.name}</h4>
                      {adData.user.profile.type === 'COMPANY' && (
                        <Badge variant="outline" className="mr-2 text-xs">
                          موثق
                        </Badge>
                      )}
                    </div>
                    <StarRating 
                      rating={adData.user.profile.rating} 
                      size="sm" 
                      showText={true}
                    />
                    <p className="text-xs text-gray-500">
                      عضو منذ {formatDate(adData.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => window.open(`tel:${adData.contactPhone}`, '_self')}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    اتصل الآن
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="lg"
                    onClick={() => setShowMessageModal(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    إرسال رسالة
                  </Button>
                  {adData.contactWhatsapp && (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="lg"
                      onClick={() => window.open(`https://wa.me/${adData.contactWhatsapp}`, '_blank')}
                    >
                      📱 واتساب
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Similar Ads */}
            <Card>
              <CardHeader>
                <CardTitle>إعلانات مشابهة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {similarAds.length > 0 ? (
                  similarAds.map((ad) => {
                    // Process similar ads like the main ads page
                    const primaryImage = ad.media?.find((m: { isPrimary: boolean; fileType: string; filePath: string }) => m.isPrimary && m.fileType === 'IMAGE')?.filePath
                    const firstImage = ad.media?.find((m: { fileType: string; filePath: string }) => m.fileType === 'IMAGE')?.filePath
                    const finalImage = primaryImage || firstImage || ad.media?.[0]?.filePath || '/placeholder-ad.jpg'
                    
                    const processedAd = {
                      ...ad,
                      imageUrl: finalImage,
                      category: typeof ad.category === 'string' ? ad.category : ad.category?.nameAr || 'عام',
                      views: ad.viewsCount || 0,
                      price: ad.price ?? null,
                      location: ad.location ?? null
                    }
                    
                    return (
                      <div key={ad.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <AdCard {...processedAd} viewType="list" />
                      </div>
                    )
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">لا توجد إعلانات مشابهة حالياً</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery Modal */}
      {showFullScreenGallery && adData?.media && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20 z-10"
              onClick={() => setShowFullScreenGallery(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Media Counter */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-10">
              {currentImageIndex + 1} / {adData.media.length}
            </div>

            {/* Main Media Display */}
            <div className="relative w-full h-full flex items-center justify-center">
              {adData.media[currentImageIndex]?.fileType === 'VIDEO' ? (
                <video
                  src={adData.media[currentImageIndex].filePath}
                  controls
                  className="max-w-full max-h-full object-contain"
                  autoPlay
                  onError={() => setVideoError(true)}
                >
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              ) : (
                <Image
                  src={adData.media[currentImageIndex]?.filePath || '/placeholder-ad.jpg'}
                  alt={adData.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>

            {/* Navigation Arrows */}
            {adData.media.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="lg"
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'right-8' : 'left-8'} bg-white/10 text-white hover:bg-white/20`}
                  onClick={prevImage}
                >
                  {isRTL ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-8' : 'right-8'} bg-white/10 text-white hover:bg-white/20`}
                  onClick={nextImage}
                >
                  {isRTL ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
                </Button>
              </>
            )}

            {/* Thumbnail Strip */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 max-w-4xl">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide bg-black/30 p-4 rounded-lg">
                {adData.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                      index === currentImageIndex ? 'border-white scale-110' : 'border-gray-400 hover:border-gray-200'
                    }`}
                  >
                    {media.fileType === 'VIDEO' ? (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <Image
                        src={media.filePath}
                        alt=""
                        fill
                        className="object-cover"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && getCurrentVideo() && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/10 text-white hover:bg-white/20 z-10"
              onClick={() => setShowVideoModal(false)}
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Video Player */}
            <div className="relative max-w-5xl max-h-full">
              {videoError ? (
                <div className="flex flex-col items-center justify-center text-white p-8">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl mb-2">خطأ في تشغيل الفيديو</h3>
                  <p className="text-gray-300 mb-4">عذراً، لا يمكن تشغيل هذا الفيديو</p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setVideoError(false)
                      setShowVideoModal(false)
                    }}
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    إغلاق
                  </Button>
                </div>
              ) : (
                <video
                  src={getCurrentVideo()?.filePath}
                  controls
                  className="max-w-full max-h-full rounded-lg"
                  autoPlay
                  onError={() => setVideoError(true)}
                >
                  متصفحك لا يدعم تشغيل الفيديو
                </video>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>إرسال رسالة</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMessageModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  رسالة إلى {adData?.user.name}
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSendMessage}
                  disabled={!messageText.trim() || sendingMessage}
                  className="flex-1"
                >
                  {sendingMessage ? 'جاري الإرسال...' : 'إرسال'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMessageModal(false)}
                >
                  إلغاء
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
