import { Search, MapPin, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/hooks/useLanguage"

export function HeroSection() {
  const { t, getDirection } = useLanguage()
  const isRTL = getDirection() === 'rtl'

  return (
    <section className="relative bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              {t('site.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {t('site.description')}
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <Input
                    type="text"
                    placeholder={t('search.placeholder')}
                    className={`w-full bg-white text-gray-900 border-0 h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl focus:ring-2 focus:ring-white/30`}
                  />
                </div>
                
                <div className="flex-1 relative">
                  <MapPin className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 ${isRTL ? 'right-4' : 'left-4'}`} />
                  <Input
                    type="text"
                    placeholder={t('filter.location')}
                    className={`w-full bg-white text-gray-900 border-0 h-12 ${isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'} rounded-xl focus:ring-2 focus:ring-white/30`}
                  />
                </div>
                
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 h-12 rounded-xl font-semibold">
                  {t('search.button')}
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold">10,000+</div>
              <div className="text-blue-200 text-sm">{t('nav.ads')}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-blue-200 text-sm">عضو نشط</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200 text-sm">مدينة</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 px-8 font-semibold">
              {t('nav.post_ad')}
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-8 font-semibold">
              <TrendingUp className="w-5 h-5 mr-2" />
              {t('search.advanced')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
