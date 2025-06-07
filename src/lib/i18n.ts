export const languages = {
  ar: {
    name: 'العربية',
    direction: 'rtl',
    flag: '🇸🇾',
    fontFamily: 'cairo'
  },
  en: {
    name: 'English',
    direction: 'ltr',
    flag: '🇺🇸',
    fontFamily: 'inter'
  },
  tr: {
    name: 'Türkçe',
    direction: 'ltr',
    flag: '🇹🇷',
    fontFamily: 'inter'
  },
  fr: {
    name: 'Français',
    direction: 'ltr',
    flag: '🇫🇷',
    fontFamily: 'inter'
  },
  ku: {
    name: 'کوردی',
    direction: 'rtl',
    flag: '🏳️',
    fontFamily: 'cairo'
  }
} as const;

export type Language = keyof typeof languages;

export const translations = {
  ar: {
    // Site Info
    'site.title': 'بازار سوريا',
    'site.description': 'أكبر منصة إعلانات مبوبة في سوريا',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.ads': 'الإعلانات',
    'nav.categories': 'الفئات',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.post_ad': 'أضف إعلان',
    'nav.dashboard': 'لوحة التحكم',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    
    // Search & Filter
    'search.placeholder': 'ابحث عن إعلان...',
    'search.button': 'بحث',
    'search.advanced': 'بحث متقدم',
    'filter.category': 'الفئة',
    'filter.price': 'السعر',
    'filter.location': 'الموقع',
    'filter.condition': 'الحالة',
    'filter.type': 'النوع',
    'filter.from': 'من',
    'filter.to': 'إلى',
    'filter.apply': 'تطبيق الفلتر',
    'filter.clear': 'مسح الفلتر',
    
    // Ad Details
    'ad.price': 'السعر',
    'ad.location': 'الموقع',
    'ad.contact_seller': 'تواصل مع البائع',
    'ad.whatsapp': 'واتساب',
    'ad.phone': 'هاتف',
    'ad.email': 'بريد إلكتروني',
    'ad.views': 'مشاهدة',
    'ad.posted': 'نُشر في',
    'ad.updated': 'آخر تحديث',
    'ad.description': 'الوصف',
    'ad.features': 'المميزات',
    'ad.seller_info': 'معلومات البائع',
    'ad.similar_ads': 'إعلانات مشابهة',
    'ad.add_to_favorites': 'إضافة للمفضلة',
    'ad.remove_from_favorites': 'إزالة من المفضلة',
    'ad.share': 'مشاركة',
    'ad.report': 'إبلاغ',
    
    // Categories
    'category.real_estate': 'العقارات',
    'category.cars': 'السيارات',
    'category.electronics': 'الإلكترونيات',
    'category.jobs': 'الوظائف',
    'category.services': 'الخدمات',
    'category.other': 'أخرى',
    
    // Ad Types
    'sale': 'للبيع',
    'rent': 'للإيجار',
    'type.sale': 'للبيع',
    'type.rent': 'للإيجار',
    'type.wanted': 'مطلوب',
    
    // Common
    'promoted': 'مُميز',
    'noImage': 'لا توجد صورة',
    
    // Conditions
    'condition.new': 'جديد',
    'condition.used': 'مستعمل',
    'condition.excellent': 'ممتاز',
    'condition.good': 'جيد',
    'condition.fair': 'مقبول',
    
    // Forms
    'form.title': 'العنوان',
    'form.description': 'الوصف',
    'form.price': 'السعر',
    'form.location': 'الموقع',
    'form.phone': 'رقم الهاتف',
    'form.whatsapp': 'واتساب',
    'form.email': 'البريد الإلكتروني',
    'form.images': 'الصور',
    'form.submit': 'إرسال',
    'form.cancel': 'إلغاء',
    'form.save': 'حفظ',
    'form.edit': 'تعديل',
    'form.delete': 'حذف',
    
    // Messages
    'message.success': 'تم بنجاح',
    'message.error': 'حدث خطأ',
    'message.loading': 'جارٍ التحميل...',
    'message.no_results': 'لا توجد نتائج',
    'message.confirm_delete': 'هل أنت متأكد من الحذف؟',
    
    // Reviews
    'review.title': 'التقييمات',
    'review.add': 'إضافة تقييم',
    'review.rating': 'التقييم',
    'review.comment': 'التعليق',
    'review.submit': 'إرسال التقييم',
  },
  
  en: {
    // Site Info
    'site.title': 'Pazar Syria',
    'site.description': 'The largest classified ads platform in Syria',
    
    // Navigation
    'nav.home': 'Home',
    'nav.ads': 'Ads',
    'nav.categories': 'Categories',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.post_ad': 'Post Ad',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    
    // Search & Filter
    'search.placeholder': 'Search for ads...',
    'search.button': 'Search',
    'search.advanced': 'Advanced Search',
    'filter.category': 'Category',
    'filter.price': 'Price',
    'filter.location': 'Location',
    'filter.condition': 'Condition',
    'filter.type': 'Type',
    'filter.from': 'From',
    'filter.to': 'To',
    'filter.apply': 'Apply Filter',
    'filter.clear': 'Clear Filter',
    
    // Ad Details
    'ad.price': 'Price',
    'ad.location': 'Location',
    'ad.contact_seller': 'Contact Seller',
    'ad.whatsapp': 'WhatsApp',
    'ad.phone': 'Phone',
    'ad.email': 'Email',
    'ad.views': 'views',
    'ad.posted': 'Posted on',
    'ad.updated': 'Last updated',
    'ad.description': 'Description',
    'ad.features': 'Features',
    'ad.seller_info': 'Seller Information',
    'ad.similar_ads': 'Similar Ads',
    'ad.add_to_favorites': 'Add to Favorites',
    'ad.remove_from_favorites': 'Remove from Favorites',
    'ad.share': 'Share',
    'ad.report': 'Report',
    
    // Categories
    'category.real_estate': 'Real Estate',
    'category.cars': 'Cars',
    'category.electronics': 'Electronics',
    'category.jobs': 'Jobs',
    'category.services': 'Services',
    
    // Ad Types
    'type.sale': 'For Sale',
    'type.rent': 'For Rent',
    'type.wanted': 'Wanted',
    
    // Conditions
    'condition.new': 'New',
    'condition.used': 'Used',
    'condition.excellent': 'Excellent',
    'condition.good': 'Good',
    'condition.fair': 'Fair',
    
    // Forms
    'form.title': 'Title',
    'form.description': 'Description',
    'form.price': 'Price',
    'form.location': 'Location',
    'form.phone': 'Phone Number',
    'form.whatsapp': 'WhatsApp',
    'form.email': 'Email',
    'form.images': 'Images',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.edit': 'Edit',
    'form.delete': 'Delete',
    
    // Messages
    'message.success': 'Success',
    'message.error': 'Error occurred',
    'message.loading': 'Loading...',
    'message.no_results': 'No results found',
    'message.confirm_delete': 'Are you sure you want to delete?',
    
    // Reviews
    'review.title': 'Reviews',
    'review.add': 'Add Review',
    'review.rating': 'Rating',
    'review.comment': 'Comment',
    'review.submit': 'Submit Review',
  },
  
  // Similar structure for tr, fr, ku languages...
  tr: {
    'site.title': 'Pazar Suriye',
    'nav.home': 'Ana Sayfa',
    'nav.ads': 'İlanlar',
    'nav.login': 'Giriş',
    'nav.post_ad': 'İlan Ver',
    // ... add more translations
  },
  
  fr: {
    'site.title': 'Pazar Syrie',
    'nav.home': 'Accueil',
    'nav.ads': 'Annonces',
    'nav.login': 'Connexion',
    'nav.post_ad': 'Publier une annonce',
    // ... add more translations
  },
  
  ku: {
    'site.title': 'بازاری سوریا',
    'nav.home': 'ماڵەوە',
    'nav.ads': 'ڕیکلامەکان',
    'nav.login': 'چوونەژوورەوە',
    'nav.post_ad': 'ڕیکلام بنووسە',
    // ... add more translations
  }
} as const;
