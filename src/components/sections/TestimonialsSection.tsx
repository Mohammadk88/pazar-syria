'use client'

import { Star, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'أحمد محمد',
    role: 'مطور عقاري',
    location: 'دمشق',
    rating: 5,
    comment: 'منصة رائعة وسهلة الاستخدام. تمكنت من بيع عقاري خلال أسبوع واحد فقط. الواجهة بسيطة والخدمة ممتازة.',
    avatar: '/api/placeholder/64/64?text=أحمد'
  },
  {
    id: 2,
    name: 'فاطمة الأحمد',
    role: 'ربة منزل',
    location: 'حلب',
    rating: 5,
    comment: 'وجدت السيارة المثالية لعائلتي بسعر ممتاز. البائع كان صادقاً والصفقة تمت بسلاسة تامة.',
    avatar: '/api/placeholder/64/64?text=فاطمة'
  },
  {
    id: 3,
    name: 'محمد العلي',
    role: 'تاجر سيارات',
    location: 'اللاذقية',
    rating: 5,
    comment: 'أفضل منصة لبيع السيارات في سوريا. عدد الزوار عالي والإعلانات تصل لجمهور واسع.',
    avatar: '/api/placeholder/64/64?text=محمد'
  },
  {
    id: 4,
    name: 'سارة حسن',
    role: 'مهندسة معمارية',
    location: 'حمص',
    rating: 5,
    comment: 'استخدمت المنصة للبحث عن مكتب لشركتي. النتائج كانت دقيقة والخيارات متنوعة جداً.',
    avatar: '/api/placeholder/64/64?text=سارة'
  },
  {
    id: 5,
    name: 'يوسف الشامي',
    role: 'طالب جامعي',
    location: 'دمشق',
    rating: 5,
    comment: 'وجدت شقة مناسبة لميزانيتي كطالب. التعامل كان مهني والأسعار معقولة جداً.',
    avatar: '/api/placeholder/64/64?text=يوسف'
  },
  {
    id: 6,
    name: 'ليلى محفوض',
    role: 'مديرة مبيعات',
    location: 'طرطوس',
    rating: 5,
    comment: 'خدمة عملاء ممتازة وردود سريعة. المنصة تساعد على التواصل المباشر مع البائعين.',
    avatar: '/api/placeholder/64/64?text=ليلى'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="testimonial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="m 40 0 l 0 40 l -40 0 Z" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#testimonial-grid)" />
        </svg>
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-blue-200 px-6 py-3 rounded-full text-sm font-medium mb-6 border border-white/20">
            <Star className="w-4 h-4" />
            آراء العملاء
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ماذا يقول عملاؤنا؟
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            استمع لتجارب عملائنا الحقيقية وكيف ساعدتهم منصتنا في تحقيق أهدافهم
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="group bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-2">
              {/* Quote icon */}
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Quote className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              {/* Comment */}
              <p className="text-white text-center mb-8 leading-relaxed text-lg">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              {/* User info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                  {testimonial.name.split(' ')[0].charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white text-lg">{testimonial.name}</div>
                  <div className="text-blue-200 text-sm">{testimonial.role}</div>
                  <div className="text-blue-300 text-sm">{testimonial.location}</div>
                </div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-8 bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/20">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">4.9</div>
              <div className="text-blue-200 text-sm">متوسط التقييم</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">2,500+</div>
              <div className="text-blue-200 text-sm">تقييم إيجابي</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98%</div>
              <div className="text-blue-200 text-sm">رضا العملاء</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
