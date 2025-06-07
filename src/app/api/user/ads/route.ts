import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'

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

    // Get user's ads
    const ads = await prisma.ad.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
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
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' },
      ],
    })

    return NextResponse.json({ ads })
  } catch (error) {
    console.error('Error fetching user ads:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user ads' },
      { status: 500 }
    )
  }
}
