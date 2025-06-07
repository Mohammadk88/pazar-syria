import { prisma } from './src/lib/prisma.js'

async function createTestAds() {
  console.log('Creating test ads...')

  try {
    // Get existing categories
    const realEstateCategory = await prisma.category.findUnique({
      where: { slug: 'real-estate' }
    })
    
    const carsCategory = await prisma.category.findUnique({
      where: { slug: 'cars' }
    })

    if (!realEstateCategory || !carsCategory) {
      console.log('Categories not found, please run migration first')
      return
    }

    // Get existing users or create one
    let user = await prisma.user.findFirst()
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+963991234567',
          passwordHash: 'password',
          profile: {
            create: {
              type: 'PERSONAL',
              location: 'دمشق',
              rating: 4.5,
              totalReviews: 10
            }
          }
        },
        include: { profile: true }
      })
    }

    // Create a real estate ad
    const realEstateAd = await prisma.ad.create({
      data: {
        title: 'شقة رائعة للبيع في دمشق',
        description: 'شقة جميلة ومجهزة بالكامل في منطقة راقية في دمشق. تتميز بموقع ممتاز وإطلالة رائعة.',
        price: 50000000,
        currency: 'SYP',
        location: 'دمشق - المالكي',
        adType: 'SALE',
        condition: 'NEW',
        categoryId: realEstateCategory.id,
        userId: user.id,
        media: {
          create: [
            {
              filePath: '/placeholder-apartment.jpg',
              fileType: 'IMAGE',
              isPrimary: true,
              sortOrder: 1
            }
          ]
        },
        propertyDetails: {
          create: {
            propertyType: 'APARTMENT',
            area: 120,
            bedrooms: 3,
            bathrooms: 2,
            floor: 5,
            totalFloors: 10,
            buildYear: 2020,
            hasGarage: true,
            hasGarden: false,
            hasElevator: true,
            hasSecurity: true,
            hasPool: false,
            hasBalcony: true,
            furnished: 'FURNISHED',
            heatingType: 'CENTRAL',
            features: ['إطلالة رائعة', 'قريب من المدارس', 'موقف سيارة', 'مصعد']
          }
        }
      }
    })

    // Create a car ad
    const carAd = await prisma.ad.create({
      data: {
        title: 'BMW X5 2020 للبيع',
        description: 'سيارة BMW X5 موديل 2020 بحالة ممتازة، قليلة الاستعمال، جميع الخدمات منجزة.',
        price: 25000000,
        currency: 'SYP',
        location: 'دمشق - الميدان',
        adType: 'SALE',
        condition: 'EXCELLENT',
        categoryId: carsCategory.id,
        userId: user.id,
        media: {
          create: [
            {
              filePath: '/placeholder-car.jpg',
              fileType: 'IMAGE',
              isPrimary: true,
              sortOrder: 1
            }
          ]
        },
        carDetails: {
          create: {
            brand: 'BMW',
            model: 'X5',
            year: 2020,
            mileage: 45000,
            fuelType: 'GASOLINE',
            transmission: 'AUTOMATIC',
            engineSize: 3.0,
            horsePower: 265,
            color: 'أسود',
            bodyType: 'SUV',
            drivetrain: 'AWD',
            hasAirConditioning: true,
            hasLeatherSeats: true,
            hasSunroof: true,
            hasNavigationSystem: true,
            hasBluetoothConnectivity: true,
            hasParkingSensors: true,
            hasBackupCamera: true,
            features: ['مقاعد جلدية', 'فتحة سقف', 'نظام ملاحة', 'كاميرا خلفية']
          }
        }
      }
    })

    console.log('✅ Test ads created successfully')
    console.log(`Real Estate Ad ID: ${realEstateAd.id}`)
    console.log(`Car Ad ID: ${carAd.id}`)

  } catch (error) {
    console.error('Error creating test ads:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestAds()
