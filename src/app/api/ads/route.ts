import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { Prisma, AdType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const category = searchParams.get('category')
    const adType = searchParams.get('adType') || searchParams.get('type')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'newest'

    console.log('🔍 API Filter Debug:', { category, adType, search, page, limit })

    const skip = (page - 1) * limit

    // Build where clause
    const where: Prisma.AdWhereInput = {
      isActive: true,
    }

    if (category && category !== '') {
      where.category = {
        slug: category,
      }
      console.log('📂 Filtering by category:', category)
    }

    if (adType && Object.values(AdType).includes(adType as AdType)) {
      where.adType = adType as AdType
      console.log('🏷️ Filtering by type:', adType)
    }

    if (search && search !== '') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ]
      console.log('🔍 Searching for:', search)
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    // Build order by clause
    let orderBy: Prisma.AdOrderByWithRelationInput[] = []
    
    switch (sort) {
      case 'oldest':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'asc' }]
        break
      case 'price_low':
        orderBy = [{ isFeatured: 'desc' }, { price: 'asc' }]
        break
      case 'price_high':
        orderBy = [{ isFeatured: 'desc' }, { price: 'desc' }]
        break
      case 'views':
        orderBy = [{ isFeatured: 'desc' }, { viewsCount: 'desc' }]
        break
      case 'featured':
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
        break
      default: // newest
        orderBy = [{ isFeatured: 'desc' }, { createdAt: 'desc' }]
    }

    // Get ads with relations
    const ads = await prisma.ad.findMany({
      where,
      include: {
        category: true,
        user: {
          include: {
            profile: true,
          },
        },
        media: true,
        _count: {
          select: {
            favorites: true,
            reviews: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    })

    // Get total count for pagination
    const total = await prisma.ad.count({ where })

    console.log(`📊 Found ${ads.length} ads out of ${total} total`)

    return NextResponse.json({
      ads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('❌ Error fetching ads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ads' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions) as { user?: { id: string } } | null
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = session.user.id

    const body = await request.json()
    const {
      title,
      description,
      category,
      adType,
      condition,
      price,
      currency,
      location,
      phone,
      whatsapp,
      email,
      features,
      media,
      propertyData,
      carData
    } = body

    // Validate required fields
    if (!title || !description || !category || !adType || !price || !location || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get category by slug or id
    const categoryRecord = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: category },
          { id: category }
        ]
      }
    })

    if (!categoryRecord) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    // Create the ad
    const ad = await prisma.ad.create({
      data: {
        title,
        description,
        adType: adType as AdType,
        condition,
        price: parseFloat(price),
        currency,
        location,
        contactPhone: phone,
        contactWhatsapp: whatsapp,
        contactEmail: email,
        properties: features || [],
        userId,
        categoryId: categoryRecord.id,
        isActive: true,
      },
      include: {
        category: true,
        user: {
          include: {
            profile: true,
          },
        },
      },
    })

    // Create property details if real estate
    if (propertyData && categoryRecord.slug === 'real-estate') {
      await prisma.propertyDetails.create({
        data: {
          adId: ad.id,
          propertyType: propertyData.propertyType || 'APARTMENT',
          area: propertyData.area ? parseInt(propertyData.area) : null,
          bedrooms: propertyData.bedrooms ? parseInt(propertyData.bedrooms) : null,
          bathrooms: propertyData.bathrooms ? parseInt(propertyData.bathrooms) : null,
          floor: propertyData.floor ? parseInt(propertyData.floor) : null,
          buildYear: propertyData.buildYear ? parseInt(propertyData.buildYear) : null,
          hasGarage: propertyData.hasGarage || false,
          furnished: propertyData.furnished ? 'FURNISHED' : 'UNFURNISHED',
          hasElevator: propertyData.hasElevator || false,
          hasBalcony: propertyData.hasBalcony || false,
          hasGarden: propertyData.hasGarden || false,
          heatingType: propertyData.heating ? 'CENTRAL' : null,
        },
      })
    }

    // Create car details if cars
    if (carData && categoryRecord.slug === 'cars') {
      await prisma.carDetails.create({
        data: {
          adId: ad.id,
          brand: carData.make || 'Other',
          model: carData.model || 'Unknown',
          year: carData.year ? parseInt(carData.year) : new Date().getFullYear(),
          mileage: carData.mileage ? parseInt(carData.mileage) : null,
          fuelType: carData.fuelType || 'GASOLINE',
          transmission: carData.transmission || 'MANUAL',
          engineSize: carData.engineSize ? parseFloat(carData.engineSize) : null,
          color: carData.color || null,
          bodyType: carData.bodyType || 'SEDAN',
          drivetrain: carData.drivetrain || null,
          hasAirConditioning: carData.hasAirConditioning || false,
        },
      })
    }

    // Create media records for images and videos if any
    if (media && media.length > 0) {
      const mediaData = media.map((mediaItem: {url: string, type: string}, index: number) => ({
        adId: ad.id,
        url: mediaItem.url,
        type: mediaItem.type.startsWith('video/') ? 'VIDEO' as const : 'IMAGE' as const,
        isPrimary: index === 0, // First media item is primary
      }))

      await prisma.adMedia.createMany({
        data: mediaData,
      })
    }

    return NextResponse.json(ad, { status: 201 })
  } catch (error) {
    console.error('Error creating ad:', error)
    return NextResponse.json(
      { error: 'Failed to create ad' },
      { status: 500 }
    )
  }
}
