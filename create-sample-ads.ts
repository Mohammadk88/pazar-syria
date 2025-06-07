import { prisma } from './src/lib/prisma.js'

// Local real estate images (using downloaded images)
const realEstateImages = [
  '/images/ads/real-estate/apartment-1.jpg',
  '/images/ads/real-estate/apartment-2.jpg',
  '/images/ads/real-estate/apartment-3.jpg',
  '/images/ads/real-estate/apartment-4.jpg',
  '/images/ads/real-estate/villa-1.jpg',
  '/images/ads/real-estate/house-1.jpg',
  '/images/ads/real-estate/house-2.jpg',
  '/images/ads/real-estate/kitchen-1.jpg',
  '/images/ads/real-estate/bathroom-1.jpg'
]

// Local car images (using downloaded images)
const carImages = [
  '/images/ads/cars/bmw-1.jpg',
  '/images/ads/cars/mercedes-1.jpg',
  '/images/ads/cars/audi-1.jpg',
  '/images/ads/cars/toyota-1.jpg',
  '/images/ads/cars/honda-1.jpg',
  '/images/ads/cars/hyundai-1.jpg',
  '/images/ads/cars/kia-1.jpg',
  '/images/ads/cars/porsche-1.jpg',
  '/images/ads/cars/lexus-1.jpg'
]

const realEstateData = [
  {
    title: 'شقة فاخرة في دمشق القديمة',
    description: 'شقة تراثية مرممة حديثاً في قلب دمشق القديمة، تتميز بالتصميم الأصيل والمرافق العصرية.',
    price: 75000000,
    location: 'دمشق - القصاع',
    area: 150,
    bedrooms: 4,
    bathrooms: 2,
    features: ['إطلالة على القلعة', 'حديقة خاصة', 'مدفأة تراثية', 'موقف سيارة']
  },
  {
    title: 'بنتهاوس مع تراس في المزة',
    description: 'بنتهاوس حديث مع تراس كبير وإطلالة بانورامية على دمشق.',
    price: 120000000,
    location: 'دمشق - المزة',
    area: 200,
    bedrooms: 3,
    bathrooms: 3,
    features: ['تراس 80 متر', 'إطلالة بانورامية', 'مصعد خاص', 'حمام سباحة مشترك']
  },
  {
    title: 'فيلا مستقلة في المالكي',
    description: 'فيلا فخمة مستقلة مع حديقة وموقف سيارتين في أرقى أحياء دمشق.',
    price: 180000000,
    location: 'دمشق - المالكي',
    area: 300,
    bedrooms: 5,
    bathrooms: 4,
    features: ['حديقة 200 متر', 'موقف سيارتين', 'حمام سباحة', 'غرفة خادمة']
  },
  {
    title: 'شقة حديثة في كفرسوسة',
    description: 'شقة جديدة بتشطيبات عالية الجودة في منطقة هادئة وحيوية.',
    price: 45000000,
    location: 'دمشق - كفرسوسة',
    area: 110,
    bedrooms: 3,
    bathrooms: 2,
    features: ['تشطيبات حديثة', 'بلكونة', 'قريب من الجامعة', 'أمان 24/7']
  }
]

const carData = [
  {
    title: 'BMW X5 2022 - حالة ممتازة',
    description: 'سيارة BMW X5 موديل 2022 بحالة الوكالة، جميع الخدمات منجزة.',
    price: 45000000,
    brand: 'BMW',
    model: 'X5',
    year: 2022,
    mileage: 25000,
    features: ['فتحة سقف', 'مقاعد جلد', 'نظام ملاحة', 'كاميرا خلفية']
  },
  {
    title: 'Mercedes C200 2021 - أبيض لؤلؤي',
    description: 'مرسيدس C200 موديل 2021 لون أبيض لؤلؤي، قليلة الاستعمال.',
    price: 38000000,
    brand: 'Mercedes',
    model: 'C200',
    year: 2021,
    mileage: 18000,
    features: ['جلد', 'بلوتوث', 'حساسات', 'مكيف أوتوماتيك']
  },
  {
    title: 'Audi A4 2020 - سبورت',
    description: 'أودي A4 سبورت موديل 2020 بحالة ممتازة وصيانة دورية منتظمة.',
    price: 32000000,
    brand: 'Audi',
    model: 'A4',
    year: 2020,
    mileage: 35000,
    features: ['إضاءة LED', 'عجلات سبورت', 'نظام صوتي متطور', 'مثبت سرعة']
  },
  {
    title: 'Toyota Camry 2023 - هايبرد',
    description: 'تويوتا كامري هايبرد 2023 اقتصادية في الوقود مع ضمان الوكالة.',
    price: 28000000,
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    mileage: 12000,
    features: ['هايبرد', 'وفر وقود', 'ضمان وكالة', 'أمان متقدم']
  }
]

async function createSampleAdsWithImages() {
  console.log('🌱 Creating sample ads with real images...')

  try {
    // Get categories
    const realEstateCategory = await prisma.category.findUnique({
      where: { slug: 'real-estate' }
    })
    
    const carsCategory = await prisma.category.findUnique({
      where: { slug: 'cars' }
    })

    if (!realEstateCategory || !carsCategory) {
      console.log('Categories not found')
      return
    }

    // Get or create a user
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Ahmed Mohammed',
          email: 'ahmed@example.com',
          phone: '+963991234567',
          passwordHash: 'password',
          profile: {
            create: {
              type: 'PERSONAL',
              location: 'دمشق',
              rating: 4.8,
              totalReviews: 25
            }
          }
        },
        include: { profile: true }
      })
    }

    // Create real estate ads
    for (let i = 0; i < realEstateData.length; i++) {
      const data = realEstateData[i]
      const images = realEstateImages.slice(i * 2, (i + 1) * 2)
      
      await prisma.ad.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          currency: 'SYP',
          location: data.location,
          adType: 'SALE',
          condition: 'EXCELLENT',
          categoryId: realEstateCategory.id,
          userId: user.id,
          media: {
            create: images.map((url, index) => ({
              filePath: url,
              fileType: 'IMAGE',
              isPrimary: index === 0,
              sortOrder: index + 1
            }))
          },
          propertyDetails: {
            create: {
              propertyType: 'APARTMENT',
              area: data.area,
              bedrooms: data.bedrooms,
              bathrooms: data.bathrooms,
              floor: Math.floor(Math.random() * 10) + 1,
              totalFloors: Math.floor(Math.random() * 5) + 10,
              buildYear: 2018 + Math.floor(Math.random() * 5),
              hasGarage: Math.random() > 0.5,
              hasGarden: Math.random() > 0.7,
              hasElevator: true,
              hasSecurity: true,
              hasPool: Math.random() > 0.8,
              hasBalcony: true,
              furnished: (['FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'] as const)[Math.floor(Math.random() * 3)],
              heatingType: 'CENTRAL',
              features: data.features
            }
          }
        }
      })
    }

    // Create car ads
    for (let i = 0; i < carData.length; i++) {
      const data = carData[i]
      const images = carImages.slice(i * 2, (i + 1) * 2)
      
      await prisma.ad.create({
        data: {
          title: data.title,
          description: data.description,
          price: data.price,
          currency: 'SYP',
          location: 'دمشق - ' + ['الميدان', 'المهاجرين', 'القصاع', 'كفرسوسة'][i],
          adType: 'SALE',
          condition: 'EXCELLENT',
          categoryId: carsCategory.id,
          userId: user.id,
          media: {
            create: images.map((url, index) => ({
              filePath: url,
              fileType: 'IMAGE',
              isPrimary: index === 0,
              sortOrder: index + 1
            }))
          },
          carDetails: {
            create: {
              brand: data.brand,
              model: data.model,
              year: data.year,
              mileage: data.mileage,
              fuelType: 'GASOLINE',
              transmission: 'AUTOMATIC',
              engineSize: 2.0 + Math.random() * 2,
              horsePower: 200 + Math.floor(Math.random() * 100),
              color: ['أسود', 'أبيض', 'فضي', 'أزرق'][Math.floor(Math.random() * 4)],
              bodyType: 'SEDAN',
              drivetrain: 'FWD',
              hasAirConditioning: true,
              hasLeatherSeats: true,
              hasSunroof: Math.random() > 0.5,
              hasNavigationSystem: true,
              hasBluetoothConnectivity: true,
              hasParkingSensors: true,
              hasBackupCamera: true,
              features: data.features
            }
          }
        }
      })
    }

    console.log('✅ Sample ads with images created successfully')

  } catch (error) {
    console.error('Error creating sample ads:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleAdsWithImages()
