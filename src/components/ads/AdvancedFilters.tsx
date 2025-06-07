'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  DollarSign,
  Home,
  Car
} from 'lucide-react'

interface FiltersState {
  category: string
  adType: string
  location: string[]
  priceMin: string
  priceMax: string
  condition: string
  propertyType: string[]
  areaMin: string
  areaMax: string
  bedrooms: string[]
  bathrooms: string[]
  floor: string[]
  buildYearMin: string
  buildYearMax: string
  furnished: string[]
  heatingType: string[]
  propertyFeatures: string[]
  brand: string[]
  model: string[]
  yearMin: string
  yearMax: string
  mileageMin: string
  mileageMax: string
  fuelType: string[]
  transmission: string[]
  engineSizeMin: string
  engineSizeMax: string
  color: string[]
  bodyType: string[]
  carFeatures: string[]
}

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FiltersState) => void
  initialFilters?: Partial<FiltersState>
  isVisible: boolean
  onToggle: () => void
}

export function AdvancedFilters({ onFiltersChange, initialFilters = {}, isVisible, onToggle }: AdvancedFiltersProps) {
  // Filter states
  const [filters, setFilters] = useState({
    category: initialFilters.category || '',
    adType: initialFilters.adType || '',
    location: initialFilters.location || [],
    priceMin: initialFilters.priceMin || '',
    priceMax: initialFilters.priceMax || '',
    condition: initialFilters.condition || '',
    // Property filters
    propertyType: initialFilters.propertyType || [],
    areaMin: initialFilters.areaMin || '',
    areaMax: initialFilters.areaMax || '',
    bedrooms: initialFilters.bedrooms || [],
    bathrooms: initialFilters.bathrooms || [],
    floor: initialFilters.floor || [],
    buildYearMin: initialFilters.buildYearMin || '',
    buildYearMax: initialFilters.buildYearMax || '',
    furnished: initialFilters.furnished || [],
    heatingType: initialFilters.heatingType || [],
    propertyFeatures: initialFilters.propertyFeatures || [],
    // Car filters
    brand: initialFilters.brand || [],
    model: initialFilters.model || [],
    yearMin: initialFilters.yearMin || '',
    yearMax: initialFilters.yearMax || '',
    mileageMin: initialFilters.mileageMin || '',
    mileageMax: initialFilters.mileageMax || '',
    fuelType: initialFilters.fuelType || [],
    transmission: initialFilters.transmission || [],
    engineSizeMin: initialFilters.engineSizeMin || '',
    engineSizeMax: initialFilters.engineSizeMax || '',
    color: initialFilters.color || [],
    bodyType: initialFilters.bodyType || [],
    carFeatures: initialFilters.carFeatures || []
  })

  const [expandedSections, setExpandedSections] = useState({
    location: true,
    price: true,
    propertyDetails: false,
    carDetails: false,
    features: false
  })

  // Filter options data
  const filterOptions = {
    categories: [
      { value: 'real-estate', label: 'عقارات', count: 1250 },
      { value: 'cars', label: 'سيارات', count: 890 },
      { value: 'electronics', label: 'إلكترونيات', count: 456 },
      { value: 'furniture', label: 'أثاث', count: 234 }
    ],
    adTypes: [
      { value: 'SALE', label: 'للبيع' },
      { value: 'RENT', label: 'للإيجار' },
      { value: 'WANTED', label: 'مطلوب' }
    ],
    locations: [
      { value: 'damascus', label: 'دمشق', count: 1200 },
      { value: 'aleppo', label: 'حلب', count: 800 },
      { value: 'homs', label: 'حمص', count: 400 },
      { value: 'latakia', label: 'اللاذقية', count: 300 },
      { value: 'tartus', label: 'طرطوس', count: 200 },
      { value: 'hama', label: 'حماة', count: 150 }
    ],
    conditions: [
      { value: 'NEW', label: 'جديد' },
      { value: 'LIKE_NEW', label: 'كالجديد' },
      { value: 'GOOD', label: 'جيد' },
      { value: 'ACCEPTABLE', label: 'مقبول' },
      { value: 'NEEDS_REPAIR', label: 'يحتاج إصلاح' }
    ],
    propertyTypes: [
      { value: 'APARTMENT', label: 'شقة', count: 500 },
      { value: 'VILLA', label: 'فيلا', count: 200 },
      { value: 'HOUSE', label: 'منزل', count: 300 },
      { value: 'OFFICE', label: 'مكتب', count: 100 },
      { value: 'SHOP', label: 'محل تجاري', count: 80 },
      { value: 'LAND', label: 'أرض', count: 70 }
    ],
    furnished: [
      { value: 'FURNISHED', label: 'مفروش' },
      { value: 'SEMI_FURNISHED', label: 'نصف مفروش' },
      { value: 'UNFURNISHED', label: 'غير مفروش' }
    ],
    heatingTypes: [
      { value: 'CENTRAL', label: 'مركزي' },
      { value: 'INDIVIDUAL', label: 'فردي' },
      { value: 'ELECTRIC', label: 'كهربائي' },
      { value: 'GAS', label: 'غاز' },
      { value: 'NONE', label: 'بدون' }
    ],
    propertyFeatures: [
      { value: 'hasGarage', label: 'موقف سيارة' },
      { value: 'hasGarden', label: 'حديقة' },
      { value: 'hasElevator', label: 'مصعد' },
      { value: 'hasSecurity', label: 'أمان 24/7' },
      { value: 'hasPool', label: 'مسبح' },
      { value: 'hasBalcony', label: 'بلكونة' }
    ],
    carBrands: [
      { value: 'BMW', label: 'BMW', count: 120 },
      { value: 'Mercedes', label: 'مرسيدس', count: 100 },
      { value: 'Audi', label: 'أودي', count: 80 },
      { value: 'Toyota', label: 'تويوتا', count: 150 },
      { value: 'Honda', label: 'هوندا', count: 90 },
      { value: 'Hyundai', label: 'هيونداي', count: 110 },
      { value: 'Kia', label: 'كيا', count: 70 },
      { value: 'Nissan', label: 'نيسان', count: 85 }
    ],
    fuelTypes: [
      { value: 'GASOLINE', label: 'بنزين' },
      { value: 'DIESEL', label: 'ديزل' },
      { value: 'HYBRID', label: 'هايبرد' },
      { value: 'ELECTRIC', label: 'كهربائي' },
      { value: 'LPG', label: 'غاز' }
    ],
    transmissions: [
      { value: 'MANUAL', label: 'يدوي' },
      { value: 'AUTOMATIC', label: 'أوتوماتيك' },
      { value: 'CVT', label: 'CVT' }
    ],
    colors: [
      { value: 'white', label: 'أبيض' },
      { value: 'black', label: 'أسود' },
      { value: 'silver', label: 'فضي' },
      { value: 'gray', label: 'رمادي' },
      { value: 'blue', label: 'أزرق' },
      { value: 'red', label: 'أحمر' },
      { value: 'green', label: 'أخضر' },
      { value: 'yellow', label: 'أصفر' }
    ],
    bodyTypes: [
      { value: 'SEDAN', label: 'سيدان' },
      { value: 'HATCHBACK', label: 'هاتشباك' },
      { value: 'SUV', label: 'دفع رباعي' },
      { value: 'COUPE', label: 'كوبيه' },
      { value: 'CONVERTIBLE', label: 'مكشوف' },
      { value: 'WAGON', label: 'ستيشن' },
      { value: 'PICKUP', label: 'بيك أب' }
    ],
    carFeatures: [
      { value: 'hasAirConditioning', label: 'مكيف' },
      { value: 'hasLeatherSeats', label: 'مقاعد جلد' },
      { value: 'hasSunroof', label: 'فتحة سقف' },
      { value: 'hasNavigationSystem', label: 'نظام ملاحة' },
      { value: 'hasBluetoothConnectivity', label: 'بلوتوث' },
      { value: 'hasParkingSensors', label: 'حساسات ركن' },
      { value: 'hasBackupCamera', label: 'كاميرا خلفية' }
    ]
  }

  // Update filters
  const updateFilter = (key: keyof FiltersState, value: string | string[]) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  // Toggle array filter
  const toggleArrayFilter = (key: keyof FiltersState, value: string) => {
    const currentValues = filters[key] as string[]
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]
    updateFilter(key, newValues)
  }

  // Toggle section
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Clear all filters
  const clearAllFilters = () => {
    const clearedFilters: FiltersState = {
      category: '',
      adType: '',
      location: [],
      priceMin: '',
      priceMax: '',
      condition: '',
      propertyType: [],
      areaMin: '',
      areaMax: '',
      bedrooms: [],
      bathrooms: [],
      floor: [],
      buildYearMin: '',
      buildYearMax: '',
      furnished: [],
      heatingType: [],
      propertyFeatures: [],
      brand: [],
      model: [],
      yearMin: '',
      yearMax: '',
      mileageMin: '',
      mileageMax: '',
      fuelType: [],
      transmission: [],
      engineSizeMin: '',
      engineSizeMax: '',
      color: [],
      bodyType: [],
      carFeatures: []
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, value) => {
      if (Array.isArray(value)) {
        return count + value.length
      }
      return count + (value ? 1 : 0)
    }, 0)
  }

  if (!isVisible) return null

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            فلتر متقدم
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="mr-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              مسح الكل
            </Button>
            <Button variant="ghost" size="sm" onClick={onToggle}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">الفئة</label>
            <select 
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">جميع الفئات</option>
              {filterOptions.categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>
          </div>

          {/* Ad Type */}
          <div>
            <label className="text-sm font-medium mb-2 block">نوع الإعلان</label>
            <select 
              value={filters.adType}
              onChange={(e) => updateFilter('adType', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">جميع الأنواع</option>
              {filterOptions.adTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="text-sm font-medium mb-2 block">الحالة</label>
            <select 
              value={filters.condition}
              onChange={(e) => updateFilter('condition', e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">جميع الحالات</option>
              {filterOptions.conditions.map(condition => (
                <option key={condition.value} value={condition.value}>
                  {condition.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location Filter */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left font-medium mb-3"
          >
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              المنطقة
              {filters.location.length > 0 && (
                <Badge variant="secondary" className="mr-2">
                  {filters.location.length}
                </Badge>
              )}
            </div>
            {expandedSections.location ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.location && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {filterOptions.locations.map(location => (
                <label key={location.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={filters.location.includes(location.value)}
                    onChange={() => toggleArrayFilter('location', location.value)}
                    className="ml-2"
                  />
                  <span className="text-sm">{location.label}</span>
                  <span className="text-xs text-gray-400">({location.count})</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium mb-3"
          >
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              السعر
            </div>
            {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {expandedSections.price && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">الحد الأدنى</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.priceMin}
                  onChange={(e) => updateFilter('priceMin', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">الحد الأعلى</label>
                <input
                  type="number"
                  placeholder="∞"
                  value={filters.priceMax}
                  onChange={(e) => updateFilter('priceMax', e.target.value)}
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Property Details (Show only for real estate) */}
        {(filters.category === 'real-estate' || !filters.category) && (
          <div>
            <button
              onClick={() => toggleSection('propertyDetails')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <div className="flex items-center">
                <Home className="w-4 h-4 mr-2" />
                تفاصيل العقار
              </div>
              {expandedSections.propertyDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {expandedSections.propertyDetails && (
              <div className="space-y-4">
                {/* Property Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">نوع العقار</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filterOptions.propertyTypes.map(type => (
                      <label key={type.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.propertyType.includes(type.value)}
                          onChange={() => toggleArrayFilter('propertyType', type.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">{type.label}</span>
                        <span className="text-xs text-gray-400">({type.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Area */}
                <div>
                  <label className="text-sm font-medium mb-2 block">المساحة (م²)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="من"
                      value={filters.areaMin}
                      onChange={(e) => updateFilter('areaMin', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      value={filters.areaMax}
                      onChange={(e) => updateFilter('areaMax', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Bedrooms & Bathrooms */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">غرف النوم</label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button
                          key={num}
                          onClick={() => toggleArrayFilter('bedrooms', num.toString())}
                          className={`px-3 py-1 text-sm border rounded ${
                            filters.bedrooms.includes(num.toString()) 
                              ? 'bg-sky-500 text-white border-sky-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">الحمامات</label>
                    <div className="flex gap-2 flex-wrap">
                      {[1, 2, 3, 4].map(num => (
                        <button
                          key={num}
                          onClick={() => toggleArrayFilter('bathrooms', num.toString())}
                          className={`px-3 py-1 text-sm border rounded ${
                            filters.bathrooms.includes(num.toString()) 
                              ? 'bg-sky-500 text-white border-sky-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Furnished */}
                <div>
                  <label className="text-sm font-medium mb-2 block">الأثاث</label>
                  <div className="flex gap-2 flex-wrap">
                    {filterOptions.furnished.map(option => (
                      <button
                        key={option.value}
                        onClick={() => toggleArrayFilter('furnished', option.value)}
                        className={`px-3 py-1 text-sm border rounded ${
                          filters.furnished.includes(option.value) 
                            ? 'bg-sky-500 text-white border-sky-500' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <label className="text-sm font-medium mb-2 block">المرافق</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filterOptions.propertyFeatures.map(feature => (
                      <label key={feature.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.propertyFeatures.includes(feature.value)}
                          onChange={() => toggleArrayFilter('propertyFeatures', feature.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Car Details (Show only for cars) */}
        {(filters.category === 'cars' || !filters.category) && (
          <div>
            <button
              onClick={() => toggleSection('carDetails')}
              className="flex items-center justify-between w-full text-left font-medium mb-3"
            >
              <div className="flex items-center">
                <Car className="w-4 h-4 mr-2" />
                تفاصيل السيارة
              </div>
              {expandedSections.carDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {expandedSections.carDetails && (
              <div className="space-y-4">
                {/* Brand */}
                <div>
                  <label className="text-sm font-medium mb-2 block">الماركة</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {filterOptions.carBrands.map(brand => (
                      <label key={brand.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand.value)}
                          onChange={() => toggleArrayFilter('brand', brand.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">{brand.label}</span>
                        <span className="text-xs text-gray-400">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Year */}
                <div>
                  <label className="text-sm font-medium mb-2 block">سنة الصنع</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="من"
                      min="1990"
                      max="2024"
                      value={filters.yearMin}
                      onChange={(e) => updateFilter('yearMin', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      min="1990"
                      max="2024"
                      value={filters.yearMax}
                      onChange={(e) => updateFilter('yearMax', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Mileage */}
                <div>
                  <label className="text-sm font-medium mb-2 block">المسافة المقطوعة (كم)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="من"
                      value={filters.mileageMin}
                      onChange={(e) => updateFilter('mileageMin', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="إلى"
                      value={filters.mileageMax}
                      onChange={(e) => updateFilter('mileageMax', e.target.value)}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Fuel Type & Transmission */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">نوع الوقود</label>
                    <div className="space-y-1">
                      {filterOptions.fuelTypes.map(fuel => (
                        <label key={fuel.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={filters.fuelType.includes(fuel.value)}
                            onChange={() => toggleArrayFilter('fuelType', fuel.value)}
                            className="ml-2"
                          />
                          <span className="text-sm">{fuel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">ناقل الحركة</label>
                    <div className="space-y-1">
                      {filterOptions.transmissions.map(trans => (
                        <label key={trans.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded">
                          <input
                            type="checkbox"
                            checked={filters.transmission.includes(trans.value)}
                            onChange={() => toggleArrayFilter('transmission', trans.value)}
                            className="ml-2"
                          />
                          <span className="text-sm">{trans.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body Type & Color */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">نوع الهيكل</label>
                    <div className="flex gap-2 flex-wrap">
                      {filterOptions.bodyTypes.map(type => (
                        <button
                          key={type.value}
                          onClick={() => toggleArrayFilter('bodyType', type.value)}
                          className={`px-3 py-1 text-sm border rounded ${
                            filters.bodyType.includes(type.value) 
                              ? 'bg-sky-500 text-white border-sky-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">اللون</label>
                    <div className="flex gap-2 flex-wrap">
                      {filterOptions.colors.map(color => (
                        <button
                          key={color.value}
                          onClick={() => toggleArrayFilter('color', color.value)}
                          className={`px-3 py-1 text-sm border rounded ${
                            filters.color.includes(color.value) 
                              ? 'bg-sky-500 text-white border-sky-500' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {color.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Car Features */}
                <div>
                  <label className="text-sm font-medium mb-2 block">المرافق</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {filterOptions.carFeatures.map(feature => (
                      <label key={feature.value} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                        <input
                          type="checkbox"
                          checked={filters.carFeatures.includes(feature.value)}
                          onChange={() => toggleArrayFilter('carFeatures', feature.value)}
                          className="ml-2"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
