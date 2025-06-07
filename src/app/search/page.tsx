'use client'

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdCard } from "@/components/ads/AdCard"
import { useLanguage } from "@/hooks/useLanguage"
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign,
  Grid,
  List,
  X
} from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Ad {
  id: string
  title: string
  price: number
  currency: string
  location: string
  adType: string
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

interface SearchFilters {
  query: string
  category: string
  adType: string
  minPrice: string
  maxPrice: string
  location: string
  condition: string
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto mb-4"></div>
        <p className="text-gray-600">جاري تحميل نتائج البحث...</p>
      </div>
    </div>}>
      <SearchPageContent />
    </Suspense>
  )
}

function SearchPageContent() {
  const { t, getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'
  const searchParams = useSearchParams()
  
  const [ads, setAds] = useState<Ad[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 0
  })
  
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams?.get('q') || '',
    category: searchParams?.get('category') || '',
    adType: searchParams?.get('type') || '',
    minPrice: '',
    maxPrice: '',
    location: '',
    condition: ''
  })

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const searchAds = useCallback(async (page: number = 1) => {
    try {
      setLoading(true)
      
      const params = new URLSearchParams()
      if (filters.query) params.append('search', filters.query)
      if (filters.category) params.append('category', filters.category)
      if (filters.adType) params.append('type', filters.adType)
      if (filters.location) params.append('location', filters.location)
      if (filters.condition) params.append('condition', filters.condition)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      params.append('page', page.toString())
      params.append('limit', '12')

      const response = await fetch(`/api/ads?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setAds(data.ads)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error searching ads:', error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      adType: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      condition: ''
    })
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    searchAds(1)
  }, [searchAds])

  const activeFiltersCount = Object.values(filters).filter(value => value !== '').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Input */}
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 ${
                  isRTL ? 'right-3' : 'left-3'
                }`} />
                <Input
                  type="text"
                  placeholder={t('search.placeholder')}
                  value={filters.query}
                  onChange={(e) => handleFilterChange('query', e.target.value)}
                  className={`w-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} h-12`}
                />
              </div>
            </div>
            
            {/* Filter Toggle and View Mode */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="w-4 h-4 mr-2" />
                فلتر
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              
              <div className="border border-gray-300 rounded-lg p-1 flex">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">فلاتر البحث</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4 mr-1" />
                    مسح الفلاتر
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2">الفئة</label>
                  <select
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">جميع الفئات</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Ad Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">نوع الإعلان</label>
                  <select
                    value={filters.adType}
                    onChange={(e) => handleFilterChange('adType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="SALE">للبيع</option>
                    <option value="RENT">للإيجار</option>
                    <option value="WANTED">مطلوب</option>
                  </select>
                </div>
                
                {/* Location */}
                <div>
                  <label className="block text-sm font-medium mb-2">الموقع</label>
                  <div className="relative">
                    <MapPin className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                      isRTL ? 'right-3' : 'left-3'
                    }`} />
                    <Input
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      placeholder="المحافظة، المدينة"
                      className={isRTL ? 'pr-10' : 'pl-10'}
                    />
                  </div>
                </div>
                
                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium mb-2">الحالة</label>
                  <select
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="NEW">جديد</option>
                    <option value="USED">مستعمل</option>
                    <option value="EXCELLENT">ممتاز</option>
                    <option value="GOOD">جيد</option>
                    <option value="FAIR">مقبول</option>
                  </select>
                </div>
                
                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">نطاق السعر</label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <Input
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        placeholder="من"
                        className={isRTL ? 'pr-10' : 'pl-10'}
                      />
                    </div>
                    <span className="text-gray-500">إلى</span>
                    <div className="relative flex-1">
                      <DollarSign className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
                        isRTL ? 'right-3' : 'left-3'
                      }`} />
                      <Input
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        placeholder="إلى"
                        className={isRTL ? 'pr-10' : 'pl-10'}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              نتائج البحث {pagination.total > 0 && `(${pagination.total} إعلان)`}
            </h2>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">جاري البحث...</p>
          </div>
        ) : ads.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد نتائج</h3>
            <p className="text-gray-600">جرب تعديل معايير البحث أو الفلاتر</p>
          </div>
        ) : (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {ads.map((ad) => (
                <AdCard 
                  key={ad.id}
                  id={ad.id}
                  title={ad.title}
                  price={ad.price}
                  currency={ad.currency}
                  location={ad.location}
                  imageUrl={ad.media?.[0]?.url}
                  category={ad.category.name}
                  adType={ad.adType as "SALE" | "RENT" | "WANTED"}
                  createdAt={ad.createdAt}
                  views={ad.viewsCount}
                  reviewCount={ad._count.reviews}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.page === 1}
                    onClick={() => searchAds(pagination.page - 1)}
                  >
                    السابق
                  </Button>
                  
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={pagination.page === page ? 'default' : 'outline'}
                        onClick={() => searchAds(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                  
                  <Button
                    variant="outline"
                    disabled={pagination.page === pagination.pages}
                    onClick={() => searchAds(pagination.page + 1)}
                  >
                    التالي
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
