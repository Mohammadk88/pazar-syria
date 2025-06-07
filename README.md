# PazarSY (بازار سوريا)

أكبر منصة إعلانات مبوبة في سوريا - A comprehensive classified ads platform for Syria.

## 🚀 المميزات الحالية (Current Features)

### ✅ تم تطويره (Completed)
- **تصميم عصري وجذاب** - Modern and attractive UI/UX
- **دعم متعدد اللغات** - Multi-language support (Arabic, English, Turkish, French, Kurdish)
- **دعم RTL** - Right-to-left support for Arabic and Kurdish
- **صفحة رئيسية تفاعلية** - Interactive homepage with hero section
- **عرض الفئات** - Categories section with beautiful icons
- **عرض الإعلانات المميزة** - Featured ads showcase
- **صفحة تفاصيل الإعلان** - Detailed ad page with image gallery
- **نظام التقييمات والمراجعات** - Reviews and ratings system
- **نموذج إضافة إعلان** - Post ad form with image upload
- **تصميم متجاوب** - Fully responsive design
- **نظام الألوان والخطوط** - Consistent color scheme and typography

### 🛠️ التقنيات المستخدمة (Tech Stack)
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database
- **Zustand** - State management
- **Lucide React** - Beautiful icons
- **Google Fonts** - Cairo font for Arabic, Inter for other languages

### 🗂️ بنية المشروع (Project Structure)
```
src/
├── app/                    # Next.js App Router pages
│   ├── ads/[id]/          # Ad details page
│   ├── post-ad/           # Post ad page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ads/               # Ad-related components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── reviews/           # Reviews and ratings
│   ├── sections/          # Homepage sections
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
├── store/                 # Zustand state management
└── types/                 # TypeScript type definitions
```

## 🎨 التصميم (Design)

### الألوان (Colors)
- **Primary**: Sky-600 (#0284c7)
- **Secondary**: Gray-200 (#e5e7eb)
- **Accent**: Orange-500 (للأزرار المهمة)

### الخطوط (Fonts)
- **Arabic/Kurdish**: Cairo
- **English/Turkish/French**: Inter

## 🚧 قيد التطوير (In Progress)

### 📋 المخطط للإسبوع القادم (Next Week)
1. **نظام المصادقة** - Authentication system (NextAuth.js)
2. **ربط قاعدة البيانات** - Database integration with Prisma
3. **رفع الصور** - Image upload functionality
4. **البحث والفلترة** - Search and filtering system
5. **لوحة تحكم المستخدم** - User dashboard
6. **نظام المفضلة** - Favorites system

### 🔮 المخطط للمستقبل (Future Plans)
- لوحة تحكم الإدارة
- نظام الدفع
- الإشعارات
- تطبيق الموبايل
- API للمطورين

## 🚀 تشغيل المشروع (Getting Started)

### المتطلبات (Prerequisites)
- Node.js 18+ 
- PostgreSQL
- npm or yarn

### التثبيت (Installation)
```bash
# استنساخ المشروع
git clone [repository-url]
cd pazar_syria

# تثبيت التبعيات
npm install

# إعداد قاعدة البيانات
cp .env.example .env
# قم بتعديل متغيرات البيئة في ملف .env

# تشغيل المايقريشن
npx prisma migrate dev

# تشغيل السيرفر
npm run dev
```

المشروع سيعمل على `http://localhost:3000`

## 📱 الصفحات المتاحة (Available Pages)

- `/` - الصفحة الرئيسية (Homepage)
- `/ads/[id]` - تفاصيل الإعلان (Ad Details)
- `/post-ad` - إضافة إعلان (Post Ad)

## 🔧 الأوامر المتاحة (Available Scripts)

```bash
npm run dev          # تشغيل السيرفر للتطوير
npm run build        # بناء المشروع للإنتاج
npm run start        # تشغيل المشروع في الإنتاج
npm run lint         # فحص الكود
```

## 📄 الترخيص (License)

MIT License - راجع ملف LICENSE للتفاصيل

---

**تم تطويره بـ ❤️ لخدمة المجتمع السوري**
