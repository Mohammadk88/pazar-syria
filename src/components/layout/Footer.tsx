'use client'

import Link from "next/link"
import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react"
import { useLanguage } from "@/hooks/useLanguage"

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{t('site.title')}</h3>
            <p className="text-gray-300 text-sm">
              {t('site.description')}
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <MessageCircle className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/ads" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.ads')}
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.categories')}
                </Link>
              </li>
              <li>
                <Link href="/post-ad" className="text-gray-300 hover:text-white transition-colors">
                  {t('nav.post_ad')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الفئات</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/real_estate" className="text-gray-300 hover:text-white transition-colors">
                  {t('category.real_estate')}
                </Link>
              </li>
              <li>
                <Link href="/categories/cars" className="text-gray-300 hover:text-white transition-colors">
                  {t('category.cars')}
                </Link>
              </li>
              <li>
                <Link href="/categories/electronics" className="text-gray-300 hover:text-white transition-colors">
                  {t('category.electronics')}
                </Link>
              </li>
              <li>
                <Link href="/categories/jobs" className="text-gray-300 hover:text-white transition-colors">
                  {t('category.jobs')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">الدعم</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors">
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; 2024 {t('site.title')}. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  )
}
