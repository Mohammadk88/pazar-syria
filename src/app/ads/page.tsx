'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AdCard } from '@/components/ads/AdCard'
import { AdvancedFilters } from '@/components/ads/AdvancedFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingOverlay } from '@/components/ui/loading'
import { 
  Grid, 
  List, 
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  MapPin,
  Search
} from 'lucide-react'
import Link from 'next/link'

interface MediaItem {
  filePath: string
  isPrimary: boolean
  type: string
  fileType?: 'IMAGE' | 'VIDEO'
}

interface AdData {
  id: string
  title: string
  price: number | null
  currency: string
  location: string | null
  category: string | { nameAr: string; nameEn: string }
  adType: "SALE" | "RENT" | "WANTED"
  createdAt: Date | string
  views?: number
  viewsCount?: number
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  isPromoted?: boolean
  media?: MediaItem[]
}

interface AdItem {
  id: string
  title: string
  price: number | null
  currency: string
  location: string | null
  imageUrl?: string
  category: string
  adType: "SALE" | "RENT" | "WANTED"
  createdAt: Date | string
  views: number
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  isPromoted?: boolean
  media?: Array<{ filePath: string, isPrimary: boolean }>
}

// Main component using search params
function AdsListPageContent() {
  const searchParams = useSearchParams()

  // State
  const [ads, setAds] = useState<AdItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Filters
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    adType: searchParams.get('type') || '',
    location: searchParams.get('location') || '',
    priceMin: searchParams.get('price_min') || '',
    priceMax: searchParams.get('price_max') || '',
    condition: searchParams.get('condition') || '',
    search: searchParams.get('q') || ''
  })

  const ITEMS_PER_PAGE = 12

  // Fetch ads function
  const fetchAds = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: ITEMS_PER_PAGE.toString(),
        sort: sortBy,
        ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v && v.trim() !== ''))
      })

      console.log('🔍 Fetching ads with params:', Object.fromEntries(params))

      const response = await fetch(`/api/ads?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      const adsWithImages = data.ads.map((ad: AdData) => {
        const primaryImage = ad.media?.find((m: MediaItem) => m.isPrimary && (m.fileType === 'IMAGE' || m.type === 'image'))?.filePath
        const firstImage = ad.media?.find((m: MediaItem) => m.fileType === 'IMAGE' || m.type === 'image')?.filePath
        const fallbackImage = ad.media?.[0]?.filePath
        const finalImage = primaryImage || firstImage || fallbackImage || '/placeholder-ad.jpg'
        
        console.log('🔍 Ad:', ad.title, 'Media count:', ad.media?.length, 'Final image:', finalImage)
        
        return {
          ...ad,
          category: typeof ad.category === 'string' ? ad.category : (ad.category as { nameAr: string })?.nameAr || 'عام',
          imageUrl: finalImage,
          views: ad.viewsCount || ad.views || 0
        }
      })

      if (append) {
        setAds(prev => [...prev, ...adsWithImages])
      } else {
        setAds(adsWithImages)
      }

      setTotalCount(data.pagination?.total || 0)
      setHasMore(data.pagination ? pageNum < data.pagination.pages : false)
      setPage(pageNum)

      console.log(`📊 Loaded ${adsWithImages.length} ads, total: ${data.pagination?.total}`)

    } catch (error) {
      console.error('❌ Error fetching ads:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, sortBy])

  // Load more function for infinity scroll
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchAds(page + 1, true)
    }
  }, [fetchAds, page, loadingMore, hasMore])

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= 
          document.documentElement.offsetHeight - 1000) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [loadMore])

  // Initial load and when filters change
  useEffect(() => {
    fetchAds(1, false)
  }, [fetchAds])

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'الأحدث' },
    { value: 'oldest', label: 'الأقدم' },
    { value: 'price_low', label: 'السعر: من الأقل للأعلى' },
    { value: 'price_high', label: 'السعر: من الأعلى للأقل' },
    { value: 'views', label: 'الأكثر مشاهدة' },
    { value: 'featured', label: 'المميزة أولاً' }
  ]

  // Update filters
  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading && ads.length === 0) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="py-4 border-b">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-sky-600 hover:text-sky-800">
                الرئيسية
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">الإعلانات</span>
              {filters.category && (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">{filters.category}</span>
                </>
              )}
            </nav>
          </div>

          {/* Controls */}
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Results count */}
              <div className="text-lg font-semibold text-gray-900">
                {Number(totalCount || 0).toLocaleString('ar-SA')} إعلان
              </div>
              
              {/* Active filters */}
              <div className="flex items-center space-x-2">
                {Object.entries(filters).map(([key, value]) => 
                  value && key !== 'search' && (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {value}
                      <button 
                        onClick={() => updateFilter(key, '')}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View type toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                  className="px-3"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewType('list')}
                  className="px-3"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Filters toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>فلترة</span>
                <ChevronDown className={`w-4 h-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="pb-6 border-t">
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    البحث
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => updateFilter('search', e.target.value)}
                      placeholder="ابحث في الإعلانات..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الفئة
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">جميع الفئات</option>
                    <option value="real-estate">عقارات</option>
                    <option value="cars">سيارات</option>
                  </select>
                </div>

                {/* Ad Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نوع الإعلان
                  </label>
                  <select
                    value={filters.adType}
                    onChange={(e) => updateFilter('adType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">الكل</option>
                    <option value="SALE">للبيع</option>
                    <option value="RENT">للإيجار</option>
                    <option value="WANTED">مطلوب</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    المنطقة
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.location}
                      onChange={(e) => updateFilter('location', e.target.value)}
                      placeholder="اختر المنطقة..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السعر
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => updateFilter('priceMin', e.target.value)}
                      placeholder="أقل سعر"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                    <span className="flex items-center text-gray-500">إلى</span>
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => updateFilter('priceMax', e.target.value)}
                      placeholder="أعلى سعر"
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الحالة
                  </label>
                  <select
                    value={filters.condition}
                    onChange={(e) => updateFilter('condition', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="NEW">جديد</option>
                    <option value="EXCELLENT">ممتاز</option>
                    <option value="GOOD">جيد</option>
                    <option value="FAIR">مقبول</option>
                  </select>
                </div>

                {/* Clear filters */}
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => setFilters({
                      category: '', adType: '', location: '', 
                      priceMin: '', priceMax: '', condition: '', search: ''
                    })}
                    className="w-full"
                  >
                    مسح الفلاتر
                  </Button>
                </div>
              </div>

              {/* Advanced Filters Button */}
              <div className="pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>فلاتر متقدمة</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                </Button>
              </div>
            </div>
          )}

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <AdvancedFilters
              onFiltersChange={(newFilters) => {
                // Convert the advanced filters to simple filters format
                const basicFilters = {
                  category: newFilters.category || '',
                  adType: newFilters.adType || '',
                  location: Array.isArray(newFilters.location) ? newFilters.location[0] || '' : newFilters.location || '',
                  priceMin: newFilters.priceMin || '',
                  priceMax: newFilters.priceMax || '',
                  condition: newFilters.condition || '',
                  search: filters.search
                }
                setFilters(basicFilters)
                fetchAds(1, false)
              }}
              initialFilters={{
                category: filters.category,
                adType: filters.adType,
                location: [filters.location].filter(Boolean),
                priceMin: filters.priceMin,
                priceMax: filters.priceMax,
                condition: filters.condition
              }}
              isVisible={showAdvancedFilters}
              onToggle={() => setShowAdvancedFilters(!showAdvancedFilters)}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {ads.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500 text-lg mb-4">
                لا توجد إعلانات مطابقة للبحث
              </div>
              <Button 
                variant="outline"
                onClick={() => setFilters({
                  category: '', adType: '', location: '', 
                  priceMin: '', priceMax: '', condition: '', search: ''
                })}
              >
                مسح الفلاتر
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Ads Grid/List */}
            <div className={
              viewType === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }>
              {ads.map((ad) => (
                <AdCard
                  key={ad.id}
                  {...ad}
                  imageUrl={ad.imageUrl}
                  viewType={viewType}
                />
              ))}
            </div>

            {/* Loading More */}
            {loadingMore && (
              <div className="flex justify-center mt-8">
                <LoadingOverlay isLoading={true} />
              </div>
            )}

            {/* Load More Button (fallback for devices without auto-scroll) */}
            {!loadingMore && hasMore && (
              <div className="flex justify-center mt-8">
                <Button onClick={loadMore} variant="outline" size="lg">
                  تحميل المزيد
                </Button>
              </div>
            )}

            {/* End message */}
            {!hasMore && ads.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                تم عرض جميع الإعلانات المتاحة
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Wrapper component with Suspense
export default function AdsListPage() {
  return (
    <Suspense fallback={<LoadingOverlay isLoading={true} />}>
      <AdsListPageContent />
    </Suspense>
  )
}
