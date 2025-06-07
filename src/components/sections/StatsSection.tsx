'use client'

import { BarChart3, Users, Building, Car, TrendingUp } from 'lucide-react'

const stats = [
  {
    icon: BarChart3,
    number: '25,000+',
    label: 'إعلان نشط',
    description: 'إعلانات متنوعة ومحدثة يومياً',
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: Users,
    number: '12,000+',
    label: 'عضو مسجل',
    description: 'مجتمع متنامي من المشترين والبائعين',
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Building,
    number: '8,500+',
    label: 'عقار متاح',
    description: 'شقق، فلل، مكاتب ومحلات تجارية',
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: Car,
    number: '6,200+',
    label: 'سيارة للبيع',
    description: 'سيارات جديدة ومستعملة بأفضل الأسعار',
    color: 'from-orange-500 to-orange-600'
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 px-6 py-3 rounded-full text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            إحصائيات المنصة
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            أرقام تتحدث عن نفسها
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            نفخر بكوننا المنصة الرائدة في سوريا مع نمو مستمر وثقة متزايدة من المستخدمين
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            
            return (
              <div key={index} className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100/50">
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
                
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Number */}
                  <div className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {stat.number}
                  </div>

                  {/* Label */}
                  <div className="text-xl font-semibold text-gray-700 mb-3">
                    {stat.label}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Hover border effect */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            )
          })}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/60 backdrop-blur-sm rounded-2xl px-8 py-6 border border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">محدث في الوقت الفعلي</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">إحصائيات دقيقة ومحدثة يومياً</span>
          </div>
        </div>
      </div>
    </section>
  )
}
