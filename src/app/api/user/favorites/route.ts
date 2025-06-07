import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
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

    // Get user's favorite ads
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        ad: {
          include: {
            category: true,
            user: {
              include: {
                profile: true,
              },
            },
            media: {
              where: { isPrimary: true },
              take: 1,
            },
            _count: {
              select: {
                favorites: true,
                reviews: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error('Error fetching user favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user favorites' },
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
    const { adId } = await request.json()

    if (!adId) {
      return NextResponse.json(
        { error: 'Ad ID is required' },
        { status: 400 }
      )
    }

    // Check if ad exists
    const ad = await prisma.ad.findUnique({
      where: { id: adId },
    })

    if (!ad) {
      return NextResponse.json(
        { error: 'Ad not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_adId: {
          userId,
          adId,
        },
      },
    })

    if (existingFavorite) {
      // Remove from favorites
      await prisma.favorite.delete({
        where: {
          userId_adId: {
            userId,
            adId,
          },
        },
      })
      return NextResponse.json({ favorited: false })
    } else {
      // Add to favorites
      await prisma.favorite.create({
        data: {
          userId,
          adId,
        },
      })
      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return NextResponse.json(
      { error: 'Failed to toggle favorite' },
      { status: 500 }
    )
  }
}
