'use client'

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { LoadingOverlay } from "@/components/ui/loading"
import { useToast } from "@/components/ui/toast"
import { useLanguage } from "@/hooks/useLanguage"
import { Upload, X, MapPin, DollarSign, Tag, FileText, AlertCircle, Play } from "lucide-react"

interface MediaFile {
  file: File
  type: 'image' | 'video'
  preview: string
}

interface Category {
  id: string
  name: string
  nameAr: string
  nameEn: string
  nameTr: string
  nameFr: string
  nameKu: string
  slug: string
}

const adTypes = [
  { id: 'SALE', name: 'للبيع' },
  { id: 'RENT', name: 'للإيجار' },
  { id: 'WANTED', name: 'مطلوب' }
]

const conditions = [
  { id: 'NEW', name: 'جديد' },
  { id: 'USED', name: 'مستعمل' },
  { id: 'EXCELLENT', name: 'ممتاز' },
  { id: 'GOOD', name: 'جيد' },
  { id: 'FAIR', name: 'مقبول' }
]

// Property-specific constants
const propertyTypes = [
  { id: 'APARTMENT', name: 'شقة' },
  { id: 'HOUSE', name: 'منزل' },
  { id: 'VILLA', name: 'فيلا' },
  { id: 'OFFICE', name: 'مكتب' },
  { id: 'SHOP', name: 'محل تجاري' },
  { id: 'WAREHOUSE', name: 'مستودع' },
  { id: 'LAND', name: 'أرض' }
]

// Car-specific constants
const carMakes = [
  'تويوتا', 'نيسان', 'هيونداي', 'كيا', 'مرسيدس', 'بي إم دبليو', 'أودي',
  'فولكس فاجن', 'فورد', 'شيفروليه', 'هوندا', 'مازدا', 'سوزوكي', 'ميتسوبيشي',
  'بيجو', 'رينو', 'ستروين', 'فيات', 'سكودا', 'أخرى'
]

const fuelTypes = [
  { id: 'GASOLINE', name: 'بنزين' },
  { id: 'DIESEL', name: 'ديزل' },
  { id: 'HYBRID', name: 'هجين' },
  { id: 'ELECTRIC', name: 'كهربائي' },
  { id: 'LPG', name: 'غاز' }
]

const transmissionTypes = [
  { id: 'MANUAL', name: 'يدوي' },
  { id: 'AUTOMATIC', name: 'أوتوماتيك' },
  { id: 'CVT', name: 'CVT' }
]

const bodyTypes = [
  { id: 'SEDAN', name: 'سيدان' },
  { id: 'HATCHBACK', name: 'هاتشباك' },
  { id: 'SUV', name: 'SUV' },
  { id: 'COUPE', name: 'كوبيه' },
  { id: 'CONVERTIBLE', name: 'قابل للتحويل' },
  { id: 'WAGON', name: 'ستيشن واجن' },
  { id: 'PICKUP', name: 'بيك أب' },
  { id: 'VAN', name: 'فان' }
]

export default function PostAdPage() {
  const { t, getDirection, currentLanguage } = useLanguage()
  const { data: session } = useSession()
  const router = useRouter()
  const { showSuccess, showError } = useToast()
  const isRTL = getDirection() === 'rtl'
  
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    adType: '',
    condition: '',
    price: '',
    currency: 'SYP',
    location: '',
    phone: '',
    whatsapp: '',
    email: ''
  })

  // Property-specific fields
  const [propertyData, setPropertyData] = useState({
    propertyType: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    floor: '',
    buildYear: '',
    hasGarage: false,
    furnished: false,
    hasElevator: false,
    hasBalcony: false,
    hasGarden: false,
    heating: false
  })

  // Car-specific fields
  const [carData, setCarData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    fuelType: '',
    transmission: '',
    engineSize: '',
    color: '',
    bodyType: '',
    drivetrain: '',
    hasAirConditioning: false
  })
  
  const [media, setMedia] = useState<MediaFile[]>([])
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Fetch categories on component mount
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
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Helper function to get category name in current language
  const getCategoryName = (category: Category) => {
    switch (currentLanguage) {
      case 'ar': return category.nameAr
      case 'en': return category.nameEn
      case 'tr': return category.nameTr
      case 'fr': return category.nameFr
      case 'ku': return category.nameKu
      default: return category.nameAr
    }
  }

  // Redirect to login if not authenticated
  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePropertyChange = (field: string, value: string | boolean) => {
    setPropertyData(prev => ({ ...prev, [field]: value }))
  }

  const handleCarChange = (field: string, value: string | boolean) => {
    setCarData(prev => ({ ...prev, [field]: value }))
  }

  // Check if the selected category is real estate or cars
  const selectedCategory = categories.find(cat => cat.id === formData.category)
  const isRealEstate = selectedCategory?.slug === 'real-estate'
  const isCar = selectedCategory?.slug === 'cars'

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    const newMediaFiles: MediaFile[] = files.map(file => {
      const isVideo = file.type.startsWith('video/')
      return {
        file,
        type: isVideo ? 'video' : 'image',
        preview: URL.createObjectURL(file)
      }
    })
    
    setMedia(prev => [...prev, ...newMediaFiles].slice(0, 8)) // Max 8 media files
  }

  const removeMedia = (index: number) => {
    setMedia(prev => {
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview)
      return prev.filter((_, i) => i !== index)
    })
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures(prev => [...prev, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(prev => prev.filter(f => f !== feature))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Upload media files first if any
      const mediaUrls: Array<{url: string, type: string}> = []
      
      for (const mediaFile of media) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', mediaFile.file)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json()
          mediaUrls.push({
            url: uploadResult.url,
            type: uploadResult.type
          })
        } else {
          console.error('Failed to upload media:', await uploadResponse.text())
          // Use placeholder as fallback for images only
          if (mediaFile.type === 'image') {
            mediaUrls.push({
              url: '/api/placeholder?width=600&height=400',
              type: 'image/jpeg'
            })
          }
        }
      }

      // Prepare ad data
      const adData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        adType: formData.adType,
        condition: formData.condition || null,
        price: parseFloat(formData.price),
        currency: formData.currency,
        location: formData.location,
        phone: formData.phone,
        whatsapp: formData.whatsapp || null,
        email: formData.email || null,
        features,
        media: mediaUrls,
        // Add category-specific data
        propertyData: isRealEstate ? propertyData : null,
        carData: isCar ? carData : null
      }

      const response = await fetch('/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'فشل في إنشاء الإعلان')
      }

      const result = await response.json()
      
      // Show success message and redirect
      showSuccess('تم إنشاء الإعلان بنجاح!', 'سيتم توجيهك إلى صفحة الإعلان...')
      
      // Redirect to the new ad page
      setTimeout(() => {
        router.push(`/ads/${result.id}`)
      }, 1500)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ غير متوقع'
      showError('فشل في إنشاء الإعلان', errorMessage)
      setError(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('nav.post_ad')}
          </h1>
          <p className="text-gray-600">
            أضف إعلانك واصل إلى آلاف المشترين المحتملين
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    عنوان الإعلان *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="أدخل عنوان واضح ومميز للإعلان"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الفئة *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {loadingCategories ? (
                      <option disabled>جاري التحميل...</option>
                    ) : (
                      categories.map((cat: Category) => (
                        <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    نوع الإعلان *
                  </label>
                  <select
                    value={formData.adType}
                    onChange={(e) => handleInputChange('adType', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    required
                  >
                    <option value="">اختر النوع</option>
                    {adTypes.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الحالة
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => handleInputChange('condition', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">اختر الحالة</option>
                    {conditions.map(condition => (
                      <option key={condition.id} value={condition.id}>{condition.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  الوصف *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="اكتب وصفاً مفصلاً للإعلان..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent h-32 resize-none"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Property-specific fields */}
          {isRealEstate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  تفاصيل العقار
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع العقار *
                    </label>
                    <select
                      value={propertyData.propertyType}
                      onChange={(e) => handlePropertyChange('propertyType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required={isRealEstate}
                    >
                      <option value="">اختر النوع</option>
                      {propertyTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المساحة (م²) *
                    </label>
                    <Input
                      type="number"
                      value={propertyData.area}
                      onChange={(e) => handlePropertyChange('area', e.target.value)}
                      placeholder="100"
                      required={isRealEstate}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      عدد الغرف
                    </label>
                    <Input
                      type="number"
                      value={propertyData.bedrooms}
                      onChange={(e) => handlePropertyChange('bedrooms', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      عدد الحمامات
                    </label>
                    <Input
                      type="number"
                      value={propertyData.bathrooms}
                      onChange={(e) => handlePropertyChange('bathrooms', e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الطابق
                    </label>
                    <Input
                      type="number"
                      value={propertyData.floor}
                      onChange={(e) => handlePropertyChange('floor', e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      سنة البناء
                    </label>
                    <Input
                      type="number"
                      value={propertyData.buildYear}
                      onChange={(e) => handlePropertyChange('buildYear', e.target.value)}
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    المميزات
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'hasGarage', label: 'موقف سيارة' },
                      { key: 'furnished', label: 'مفروش' },
                      { key: 'hasElevator', label: 'مصعد' },
                      { key: 'hasBalcony', label: 'شرفة' },
                      { key: 'hasGarden', label: 'حديقة' },
                      { key: 'heating', label: 'تدفئة' }
                    ].map(feature => (
                      <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={propertyData[feature.key as keyof typeof propertyData] as boolean}
                          onChange={(e) => handlePropertyChange(feature.key, e.target.checked)}
                          className="form-checkbox h-4 w-4 text-sky-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Car-specific fields */}
          {isCar && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  تفاصيل السيارة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الماركة *
                    </label>
                    <select
                      value={carData.make}
                      onChange={(e) => handleCarChange('make', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      required={isCar}
                    >
                      <option value="">اختر الماركة</option>
                      {carMakes.map(make => (
                        <option key={make} value={make}>{make}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      الموديل *
                    </label>
                    <Input
                      value={carData.model}
                      onChange={(e) => handleCarChange('model', e.target.value)}
                      placeholder="كامري"
                      required={isCar}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      سنة الصنع *
                    </label>
                    <Input
                      type="number"
                      value={carData.year}
                      onChange={(e) => handleCarChange('year', e.target.value)}
                      placeholder="2020"
                      min="1980"
                      max={new Date().getFullYear() + 1}
                      required={isCar}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المسافة المقطوعة (كم)
                    </label>
                    <Input
                      type="number"
                      value={carData.mileage}
                      onChange={(e) => handleCarChange('mileage', e.target.value)}
                      placeholder="50000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع الوقود
                    </label>
                    <select
                      value={carData.fuelType}
                      onChange={(e) => handleCarChange('fuelType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">اختر النوع</option>
                      {fuelTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      ناقل الحركة
                    </label>
                    <select
                      value={carData.transmission}
                      onChange={(e) => handleCarChange('transmission', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">اختر النوع</option>
                      {transmissionTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      حجم المحرك (لتر)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      value={carData.engineSize}
                      onChange={(e) => handleCarChange('engineSize', e.target.value)}
                      placeholder="2.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      اللون
                    </label>
                    <Input
                      value={carData.color}
                      onChange={(e) => handleCarChange('color', e.target.value)}
                      placeholder="أبيض"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      نوع الهيكل
                    </label>
                    <select
                      value={carData.bodyType}
                      onChange={(e) => handleCarChange('bodyType', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    >
                      <option value="">اختر النوع</option>
                      {bodyTypes.map(type => (
                        <option key={type.id} value={type.id}>{type.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    خصائص إضافية
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'hasAirConditioning', label: 'تكييف هواء' }
                    ].map(feature => (
                      <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={carData[feature.key as keyof typeof carData] as boolean}
                          onChange={(e) => handleCarChange(feature.key, e.target.checked)}
                          className="form-checkbox h-4 w-4 text-sky-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Price and Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                السعر والموقع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السعر *
                  </label>
                  <div className="flex">
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                      className={`flex-1 ${isRTL ? 'rounded-l-none' : 'rounded-r-none'}`}
                      required
                    />
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className={`px-3 py-2 border border-gray-300 bg-gray-50 ${isRTL ? 'rounded-r-lg border-l-0' : 'rounded-l-lg border-r-0'}`}
                    >
                      <option value="SYP">ل.س</option>
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    الموقع *
                  </label>
                  <div className="relative">
                    <MapPin className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-3' : 'left-3'}`} />
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="المحافظة، المدينة"
                      className={isRTL ? 'pr-10' : 'pl-10'}
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Media */}
          <Card className="relative">
            <LoadingOverlay isLoading={isSubmitting} text="جارٍ رفع الملفات..." />
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-5 h-5 mr-2" />
                الصور والفيديوهات (اختياري)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    اضغط لاختيار الصور والفيديوهات أو اسحبها هنا
                  </p>
                  <p className="text-sm text-gray-500">
                    يمكن إضافة حتى 8 ملفات (صور: JPG, PNG, WebP | فيديوهات: MP4, WebM)
                  </p>
                </label>
              </div>

              {media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {media.map((mediaFile, index) => (
                    <div key={index} className="relative group">
                      {mediaFile.type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={mediaFile.preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="relative w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                          <video
                            src={mediaFile.preview}
                            className="w-full h-full object-cover rounded-lg"
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="w-8 h-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
                          </div>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                المميزات (اختياري)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="أضف ميزة جديدة"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline">
                  إضافة
                </Button>
              </div>
              
              {features.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {feature}
                      <button
                        type="button"
                        onClick={() => removeFeature(feature)}
                        className="hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>معلومات التواصل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    رقم الهاتف *
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+963 999 123456"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    واتساب (اختياري)
                  </label>
                  <Input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                    placeholder="+963 999 123456"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  البريد الإلكتروني (اختياري)
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-700">{error}</span>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Button 
                type="submit" 
                size="lg" 
                className="px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'جاري النشر...' : 'نشر الإعلان'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                className="px-8"
                disabled={isSubmitting}
              >
                معاينة
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
