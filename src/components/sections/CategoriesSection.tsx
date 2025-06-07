'use client'

import Link from "next/link"
import { 
  Home, 
  Car, 
  Smartphone, 
  Briefcase, 
  Wrench,
  ShoppingBag,
  PlusCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/hooks/useLanguage"
import { useEffect, useState } from "react"

interface Category {
  id: string
  nameAr: string
  nameEn: string
  slug: string
  icon: string
  _count: {
    ads: number
  }
}

import { LucideIcon } from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  home: Home,
  car: Car,
  smartphone: Smartphone,
  briefcase: Briefcase,
  wrench: Wrench,
  'shopping-bag': ShoppingBag,
}

const colorMap: Record<string, string> = {
  'real-estate': 'bg-blue-500',
  'cars': 'bg-red-500',
  'electronics': 'bg-purple-500',
  'jobs': 'bg-green-500',
  'services': 'bg-orange-500',
  'other': 'bg-gray-500'
}

export function CategoriesSection() {
  const { t } = useLanguage()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل الفئات...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('nav.categories')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            استكشف الفئات المختلفة واعثر على ما تبحث عنه
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon] || ShoppingBag
            const colorClass = colorMap[category.slug] || 'bg-gray-500'
            return (
              <Link 
                key={category.id} 
                href={`/categories/${category.slug}`}
                className="group"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1 bg-white border-0 shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 ${colorClass} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                      {category.nameAr}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {Number(category._count?.ads || 0).toLocaleString('ar-SA')} إعلان
                    </p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Add Category CTA */}
        <div className="text-center mt-12">
          <Link 
            href="/post-ad"
            className="inline-flex items-center px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition-colors duration-300"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {t('nav.post_ad')}
          </Link>
        </div>
      </div>
    </section>
  )
}
