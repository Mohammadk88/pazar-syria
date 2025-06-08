'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/ui/LogoModern'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useLanguage } from '@/hooks/useLanguage'
import { 
  Search, 
  Menu, 
  X, 
  User, 
  Plus, 
  Heart, 
  Settings, 
  LogOut,
  Globe,
  Bell,
  MessageCircle,
  ChevronDown
} from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()
  const { getDirection } = useLanguage()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const isRTL = getDirection() === 'rtl'

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.language-menu') && !target.closest('.language-button')) {
        setIsLangMenuOpen(false)
      }
      if (!target.closest('.user-menu') && !target.closest('.user-button')) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/ads?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
    const { signOut } = await import('next-auth/react')
    await signOut({ callbackUrl: '/' })
  }

  const navLinks = [
    { href: '/', label: 'الرئيسية' },
    { href: '/ads?category=real-estate', label: 'العقارات' },
    { href: '/ads?category=cars', label: 'السيارات' },
    { href: '/ads', label: 'جميع الإعلانات' },
  ]

  const languages = [
    { code: 'ar', name: 'العربية', flag: '🇸🇾' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ku', name: 'کوردی', flag: '🟨' },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <Logo className="group-hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors ${isRTL ? 'right-4' : 'left-4'}`} />
              <Input
                type="text"
                placeholder="ابحث عن إعلانك المثالي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`h-12 bg-gray-50/80 hover:bg-gray-50 focus:bg-white border-gray-200 hover:border-gray-300 focus:border-blue-500 rounded-full transition-all duration-300 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
              />
              <Button
                onClick={handleSearch}
                size="sm"
                className={`absolute top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full h-8 w-8 p-0 transition-all duration-300 hover:scale-110 ${isRTL ? 'left-2' : 'right-2'}`}
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Navigation Links - Hidden on mobile */}
          <nav className="hidden xl:flex items-center space-x-8 space-x-reverse">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative language-menu">
              <button
                className="language-button flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLangMenuOpen(!isLangMenuOpen)
                  setIsUserMenuOpen(false) // Close user menu
                }}
              >
                <Globe className="w-5 h-5 text-gray-600" />
                <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 min-w-[160px] z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => {
                        // TODO: Implement language change logic
                        setIsLangMenuOpen(false)
                      }}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-gray-700">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Post Ad Button */}
            <Link href="/post-ad">
              <Button 
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Plus className="w-4 h-4 ml-2 group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden sm:inline">أضف إعلان</span>
              </Button>
            </Link>

            {/* User Menu */}
            {status === 'loading' ? (
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            ) : session?.user ? (
              <div className="relative user-menu">
                <button
                  className="user-button flex items-center gap-3 p-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsUserMenuOpen(!isUserMenuOpen)
                    setIsLangMenuOpen(false) // Close language menu
                  }}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform duration-300">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    {/* Notification dot */}
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl border border-gray-200 py-2 min-w-[220px] z-50">
                    {/* User info */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{session.user.name}</div>
                      <div className="text-sm text-gray-500">{session.user.email}</div>
                    </div>

                    {/* Menu items */}
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      لوحة التحكم
                    </Link>
                    <Link 
                      href="/favorites" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Heart className="w-4 h-4" />
                      المفضلة
                    </Link>
                    <Link 
                      href="/messages" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      الرسائل
                      <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                    </Link>
                    <Link 
                      href="/notifications" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Bell className="w-4 h-4" />
                      الإشعارات
                      <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      الإعدادات
                    </Link>
                    
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsUserMenuOpen(false)
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-6 transition-all duration-300 hover:scale-105"
                  >
                    تسجيل الدخول
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    إنشاء حساب
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
              <Input
                type="text"
                placeholder="ابحث عن إعلانك المثالي..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className={`h-12 bg-gray-50 border-gray-200 rounded-full ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'}`}
              />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
