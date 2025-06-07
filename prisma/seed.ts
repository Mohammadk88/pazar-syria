import { 
  PrismaClient, 
  ProfileType, 
  AdType, 
  Condition, 
  MediaType,
  PropertyType,
  FurnishedType,
  HeatingType,
  FuelType,
  TransmissionType,
  BodyType,
  DrivetrainType
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Syrian cities and areas
const syrianLocations = [
  'دمشق - المهاجرين', 'دمشق - أبو رمانة', 'دمشق - الشعلان', 'دمشق - المزة', 'دمشق - كفر سوسة',
  'دمشق - جرمانا', 'دمشق - سيدي مقداد', 'دمشق - الأشرفية', 'دمشق - الصالحية', 'دمشق - القصاع',
  'حلب - الفرقان', 'حلب - الصاخور', 'حلب - الأشرفية', 'حلب - الحمدانية', 'حلب - شرق حلب',
  'حمص - الوعر', 'حمص - كرم الزيتون', 'حمص - الخالدية', 'حمص - القصور', 'حمص - الحميدية',
  'اللاذقية - الصليبة', 'اللاذقية - الرمل الشمالي', 'اللاذقية - الأونتيل', 'اللاذقية - الشاطئ الأزرق',
  'طرطوس - المشتل', 'طرطوس - الثورة', 'درعا - محطة درعا', 'السويداء - القريا'
]

// Car brands and models
const carData = [
  { brand: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Prius', 'Yaris', 'Highlander'] },
  { brand: 'Hyundai', models: ['Elantra', 'Tucson', 'Accent', 'Sonata', 'Santa Fe', 'i10'] },
  { brand: 'Nissan', models: ['Sentra', 'Altima', 'X-Trail', 'Micra', 'Pathfinder', 'Sunny'] },
  { brand: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'A-Class', 'CLA'] },
  { brand: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5', '1 Series', 'X1'] },
  { brand: 'Volkswagen', models: ['Golf', 'Passat', 'Polo', 'Tiguan', 'Jetta', 'Touareg'] },
  { brand: 'KIA', models: ['Cerato', 'Sportage', 'Rio', 'Sorento', 'Picanto', 'Optima'] },
  { brand: 'Chevrolet', models: ['Cruze', 'Malibu', 'Equinox', 'Captiva', 'Aveo', 'Tahoe'] },
  { brand: 'Ford', models: ['Focus', 'Fiesta', 'Edge', 'Explorer', 'Mustang', 'Escape'] },
  { brand: 'Peugeot', models: ['208', '308', '3008', '5008', '2008', '508'] }
]

// Property types data
const propertyTypesData = [
  { type: PropertyType.APARTMENT, nameAr: 'شقة', nameEn: 'Apartment' },
  { type: PropertyType.HOUSE, nameAr: 'منزل', nameEn: 'House' },
  { type: PropertyType.VILLA, nameAr: 'فيلا', nameEn: 'Villa' },
  { type: PropertyType.OFFICE, nameAr: 'مكتب', nameEn: 'Office' },
  { type: PropertyType.SHOP, nameAr: 'محل تجاري', nameEn: 'Shop' },
  { type: PropertyType.LAND, nameAr: 'أرض', nameEn: 'Land' },
  { type: PropertyType.STUDIO, nameAr: 'ستوديو', nameEn: 'Studio' }
]

// User names for variety
const userNames = [
  'أحمد محمد', 'فاطمة أحمد', 'خالد يوسف', 'مريم حسن', 'عمر السيد',
  'سارة خليل', 'محمد أبو علي', 'نور الدين', 'لينا مصطفى', 'ياسر قاسم',
  'هدى عبدالله', 'بسام الأحمد', 'رنا محمود', 'طارق صالح', 'دانا حمود',
  'سمير عتريسي', 'مايا زهرة', 'حسام درويش', 'ريما شعبان', 'نبيل حداد'
]

const companyNames = [
  'شركة العقارات الذهبية',
  'مؤسسة الشام للعقارات',
  'شركة النور للاستثمار العقاري',
  'معرض الأمان للسيارات',
  'شركة الفردوس العقارية',
  'معرض الزهراء للسيارات',
  'مكتب الرسالة العقاري',
  'شركة المستقبل للعقارات',
  'معرض البركة للسيارات',
  'شركة الأندلس العقارية'
]

// Utility functions
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomPrice(type: 'real-estate' | 'car', adType: AdType): number {
  if (type === 'real-estate') {
    if (adType === AdType.SALE) {
      return getRandomNumber(15000000, 200000000) // 15M to 200M SYP
    } else {
      return getRandomNumber(200000, 2000000) // 200K to 2M SYP monthly
    }
  } else {
    return getRandomNumber(5000000, 80000000) // 5M to 80M SYP for cars
  }
}

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // Create categories (Real Estate and Cars only)
  const realEstateCategory = await prisma.category.upsert({
    where: { slug: 'real-estate' },
    update: {},
    create: {
      nameAr: 'عقارات',
      nameEn: 'Real Estate',
      nameTr: 'Emlak',
      nameFr: 'Immobilier',
      nameKu: 'Xanî',
      slug: 'real-estate',
      icon: 'home',
      isActive: true,
    },
  })

  const carsCategory = await prisma.category.upsert({
    where: { slug: 'cars' },
    update: {},
    create: {
      nameAr: 'سيارات',
      nameEn: 'Cars',
      nameTr: 'Arabalar',
      nameFr: 'Voitures',
      nameKu: 'Otomobîl',
      slug: 'cars',
      icon: 'car',
      isActive: true,
    },
  })

  console.log('✅ Categories created')

  // Create users and profiles
  const hashedPassword = await bcrypt.hash('password123', 10)
  const users: { id: string; phone: string | null }[] = []

  // Create individual users
  for (let i = 0; i < 15; i++) {
    const user = await prisma.user.create({
      data: {
        email: `user${i + 1}@example.com`,
        phone: `+96399123${String(i + 1).padStart(4, '0')}`,
        passwordHash: hashedPassword,
        name: userNames[i] || `مستخدم ${i + 1}`,
        isVerified: Math.random() > 0.2, // 80% verified
      },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        type: ProfileType.PERSONAL,
        location: getRandomElement(syrianLocations),
        rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
        totalReviews: getRandomNumber(0, 50),
      },
    })

    users.push(user)
  }

  // Create company users
  for (let i = 0; i < 8; i++) {
    const user = await prisma.user.create({
      data: {
        email: `company${i + 1}@example.com`,
        phone: `+96399987${String(i + 1).padStart(4, '0')}`,
        passwordHash: hashedPassword,
        name: companyNames[i] || `شركة ${i + 1}`,
        isVerified: true,
      },
    })

    await prisma.profile.create({
      data: {
        userId: user.id,
        type: ProfileType.COMPANY,
        companyName: companyNames[i] || `شركة ${i + 1}`,
        description: 'شركة رائدة في مجال العقارات والسيارات، نقدم خدمات مميزة وموثوقة لعملائنا الكرام.',
        location: getRandomElement(syrianLocations),
        website: `https://company${i + 1}.sy`,
        rating: Number((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5 to 5.0
        totalReviews: getRandomNumber(50, 300),
      },
    })

    users.push(user)
  }

  // Create admin user
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pazarsy.com',
      phone: '+963999999999',
      passwordHash: hashedPassword,
      name: 'مدير النظام',
      isVerified: true,
    },
  })

  await prisma.profile.create({
    data: {
      userId: adminUser.id,
      type: ProfileType.ADMIN,
      location: 'دمشق، سوريا',
      rating: 5.0,
      totalReviews: 0,
    },
  })

  users.push(adminUser)

  console.log(`✅ Created ${users.length} users with profiles`)

  // Create Real Estate Ads (120 ads)
  const realEstateAds: { id: string; userId: string }[] = []
  for (let i = 0; i < 120; i++) {
    const user = getRandomElement(users.slice(0, -1)) // Exclude admin
    const adType = getRandomElement([AdType.SALE, AdType.RENT, AdType.RENT, AdType.SALE]) // More sales
    const propertyType = getRandomElement(propertyTypesData)
    const location = getRandomElement(syrianLocations)
    const price = getRandomPrice('real-estate', adType)
    
    const area = getRandomNumber(60, 500)
    const bedrooms = propertyType.type === PropertyType.STUDIO ? 0 : getRandomNumber(1, 5)
    const bathrooms = getRandomNumber(1, Math.max(1, Math.floor(bedrooms / 2) + 1))
    
    const title = adType === AdType.SALE 
      ? `${propertyType.nameAr} للبيع في ${location.split(' - ')[0]}`
      : `${propertyType.nameAr} للإيجار في ${location.split(' - ')[0]}`
    
    const descriptions = [
      `${propertyType.nameAr} مميزة ${adType === AdType.SALE ? 'للبيع' : 'للإيجار'} في منطقة ${location}, مساحة ${area} متر مربع, ${bedrooms > 0 ? `${bedrooms} غرف نوم` : 'ستوديو'}, ${bathrooms} حمام. موقع ممتاز وقريب من جميع الخدمات.`,
      `فرصة رائعة! ${propertyType.nameAr} ${adType === AdType.SALE ? 'للبيع' : 'للإيجار'} في ${location}, المساحة ${area} متر مربع. العقار في حالة ممتازة ومجهز بكامل المرافق. إطلالة مميزة وموقع استراتيجي.`,
      `${propertyType.nameAr} عصرية ${adType === AdType.SALE ? 'للبيع' : 'للإيجار'} في قلب ${location}. المساحة ${area} متر مربع، تصميم حديث، قريبة من المواصلات والأسواق. مناسبة للسكن أو الاستثمار.`,
    ]

    const ad = await prisma.ad.create({
      data: {
        title,
        description: getRandomElement(descriptions),
        price,
        adType,
        condition: getRandomElement([Condition.NEW, Condition.EXCELLENT, Condition.GOOD]),
        location,
        userId: user.id,
        categoryId: realEstateCategory.id,
        isFeatured: Math.random() > 0.8, // 20% featured
        contactPhone: user.phone,
        viewsCount: getRandomNumber(5, 500),
        properties: {
          area,
          bedrooms,
          bathrooms,
          furnished: getRandomElement([true, false]),
          propertyType: propertyType.type,
        },
      },
    })

    // Create PropertyDetails
    await prisma.propertyDetails.create({
      data: {
        adId: ad.id,
        propertyType: propertyType.type,
        area,
        bedrooms: bedrooms > 0 ? bedrooms : null,
        bathrooms,
        floor: propertyType.type !== PropertyType.LAND ? getRandomNumber(1, 10) : null,
        totalFloors: propertyType.type !== PropertyType.LAND ? getRandomNumber(5, 15) : null,
        buildYear: getRandomNumber(1990, 2024),
        hasGarage: Math.random() > 0.6,
        hasGarden: Math.random() > 0.7,
        hasElevator: Math.random() > 0.5,
        hasSecurity: Math.random() > 0.4,
        hasPool: Math.random() > 0.8,
        hasBalcony: Math.random() > 0.3,
        furnished: getRandomElement([FurnishedType.FURNISHED, FurnishedType.SEMI_FURNISHED, FurnishedType.UNFURNISHED]),
        heatingType: getRandomElement([HeatingType.CENTRAL, HeatingType.INDIVIDUAL, HeatingType.GAS, HeatingType.ELECTRIC]),
        features: ['تدفئة مركزية', 'موقف سيارة', 'حراسة', 'مصعد'].filter(() => Math.random() > 0.5),
      },
    })

    realEstateAds.push(ad)
  }

  console.log(`✅ Created ${realEstateAds.length} real estate ads`)

  // Create Car Ads (80 ads)
  const carAds: { id: string; userId: string }[] = []
  for (let i = 0; i < 80; i++) {
    const user = getRandomElement(users.slice(0, -1)) // Exclude admin
    const carBrand = getRandomElement(carData)
    const model = getRandomElement(carBrand.models)
    const year = getRandomNumber(2010, 2024)
    const mileage = getRandomNumber(5000, 200000)
    const price = getRandomPrice('car', AdType.SALE)
    const location = getRandomElement(syrianLocations)
    
    const title = `${carBrand.brand} ${model} ${year}`
    
    const descriptions = [
      `سيارة ${carBrand.brand} ${model} موديل ${year}، ممشى ${mileage.toLocaleString()} كم. حالة ممتازة، فحص كامل، صيانة دورية في الوكالة. السيارة نظيفة جداً وجاهزة للاستخدام.`,
      `للبيع ${carBrand.brand} ${model} ${year}، حالة جيدة جداً، ممشى ${mileage.toLocaleString()} كم. جميع الأوراق سليمة، إطارات جديدة، تكييف بارد. فرصة لا تفوت!`,
      `سيارة مميزة ${carBrand.brand} ${model} ${year}، ممشى قليل ${mileage.toLocaleString()} كم. محرك ممتاز، تبديل زيت حديث، جنوط أصلية. السعر قابل للتفاوض البسيط.`,
    ]

    const ad = await prisma.ad.create({
      data: {
        title,
        description: getRandomElement(descriptions),
        price,
        adType: AdType.SALE,
        condition: getRandomElement([Condition.USED, Condition.EXCELLENT, Condition.GOOD]),
        location,
        userId: user.id,
        categoryId: carsCategory.id,
        isFeatured: Math.random() > 0.85, // 15% featured
        contactPhone: user.phone,
        viewsCount: getRandomNumber(10, 800),
        properties: {
          brand: carBrand.brand,
          model,
          year,
          mileage,
          fuelType: getRandomElement(['بنزين', 'ديزل', 'هايبرد']),
          transmission: getRandomElement(['أوتوماتيك', 'عادي']),
        },
      },
    })

    // Create CarDetails
    await prisma.carDetails.create({
      data: {
        adId: ad.id,
        brand: carBrand.brand,
        model,
        year,
        mileage,
        fuelType: getRandomElement([FuelType.GASOLINE, FuelType.DIESEL, FuelType.HYBRID]),
        transmission: getRandomElement([TransmissionType.AUTOMATIC, TransmissionType.MANUAL]),
        engineSize: Number((Math.random() * 3 + 1).toFixed(1)), // 1.0 to 4.0L
        horsePower: getRandomNumber(100, 300),
        color: getRandomElement(['أبيض', 'أسود', 'فضي', 'أزرق', 'أحمر', 'رمادي']),
        bodyType: getRandomElement([BodyType.SEDAN, BodyType.HATCHBACK, BodyType.SUV, BodyType.COUPE]),
        drivetrain: getRandomElement([DrivetrainType.FWD, DrivetrainType.RWD, DrivetrainType.AWD]),
        hasAirConditioning: Math.random() > 0.2,
        hasLeatherSeats: Math.random() > 0.6,
        hasSunroof: Math.random() > 0.7,
        hasNavigationSystem: Math.random() > 0.5,
        hasBluetoothConnectivity: Math.random() > 0.3,
        hasParkingSensors: Math.random() > 0.6,
        hasBackupCamera: Math.random() > 0.7,
        features: ['تكييف', 'مثبت سرعة', 'نظام صوتي', 'مقاعد جلدية'].filter(() => Math.random() > 0.5),
      },
    })

    carAds.push(ad)
  }

  console.log(`✅ Created ${carAds.length} car ads`)

  // Create media for all ads
  const allAds = [...realEstateAds, ...carAds]
  for (const ad of allAds) {
    const mediaCount = getRandomNumber(1, 5)
    for (let i = 0; i < mediaCount; i++) {
      await prisma.adMedia.create({
        data: {
          adId: ad.id,
          filePath: `/uploads/${ad.id}-${i + 1}.jpg`,
          fileType: i === 0 && Math.random() > 0.8 ? MediaType.VIDEO : MediaType.IMAGE,
          isPrimary: i === 0,
          sortOrder: i + 1,
          fileName: `image-${i + 1}.jpg`,
          fileSize: getRandomNumber(100000, 2000000), // 100KB to 2MB
        },
      })
    }
  }

  console.log(`✅ Created media for all ads`)

  // Create reviews
  const reviewsToCreate: { adId: string; reviewerId: string; sellerId: string; rating: number; comment: string; isApproved: boolean }[] = []
  const reviewCombinations = new Set<string>()
  
  for (let i = 0; i < 300; i++) {
    const ad = getRandomElement(allAds)
    const reviewer = getRandomElement(users.filter(u => u.id !== ad.userId))
    const seller = users.find(u => u.id === ad.userId)
    
    const combinationKey = `${reviewer!.id}-${ad.id}`
    if (reviewCombinations.has(combinationKey)) {
      continue // Skip if this combination already exists
    }
    
    const comments = [
      'تعامل ممتاز وصادق، أنصح بالتعامل معه.',
      'شخص محترم وملتزم بالمواعيد، شكراً لك.',
      'كما هو معروض تماماً، تعامل راقي.',
      'تواصل سريع وخدمة مميزة.',
      'أسعار معقولة وجودة عالية.',
      'صاحب الإعلان متعاون جداً ومفيد.',
      'تجربة رائعة، سأتعامل معه مرة أخرى.',
      'سرعة في الرد والتجاوب الإيجابي.',
    ]

    reviewsToCreate.push({
      adId: ad.id,
      reviewerId: reviewer!.id,
      sellerId: seller!.id,
      rating: getRandomNumber(3, 5),
      comment: getRandomElement(comments),
      isApproved: Math.random() > 0.1, // 90% approved
    })
    
    reviewCombinations.add(combinationKey)
  }

  await prisma.review.createMany({
    data: reviewsToCreate,
  })

  console.log(`✅ Created ${reviewsToCreate.length} reviews`)

  // Create favorites
  const favoritesToCreate: { userId: string; adId: string }[] = []
  for (let i = 0; i < 150; i++) {
    const user = getRandomElement(users.slice(0, -1)) // Exclude admin
    const ad = getRandomElement(allAds.filter(a => a.userId !== user.id))
    
    // Check if favorite already exists
    const existingFavorite = favoritesToCreate.find(
      f => f.userId === user.id && f.adId === ad.id
    )
    
    if (!existingFavorite) {
      favoritesToCreate.push({
        userId: user.id,
        adId: ad.id,
      })
    }
  }

  await prisma.favorite.createMany({
    data: favoritesToCreate,
  })

  console.log(`✅ Created ${favoritesToCreate.length} favorites`)

  console.log('🎉 Comprehensive database seeding completed successfully!')
  console.log(`📊 Created:`)
  console.log(`   • 2 categories (Real Estate & Cars)`)
  console.log(`   • ${users.length} users (15 individuals + 8 companies + 1 admin)`)
  console.log(`   • ${users.length} profiles`)
  console.log(`   • ${allAds.length} ads (120 real estate + 80 cars)`)
  console.log(`   • ${allAds.length} property/car details`)
  console.log(`   • ${allAds.length * 2.5} media files (average)`)
  console.log(`   • ${reviewsToCreate.length} reviews`)
  console.log(`   • ${favoritesToCreate.length} favorites`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
