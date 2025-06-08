import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول لإرسال الرسائل' },
        { status: 401 }
      )
    }

    const { recipientId, adId, content } = await request.json()

    if (!recipientId || !content?.trim()) {
      return NextResponse.json(
        { error: 'البيانات المطلوبة مفقودة' },
        { status: 400 }
      )
    }

    // Don't allow sending messages to yourself
    if (session.user.id === recipientId) {
      return NextResponse.json(
        { error: 'لا يمكنك إرسال رسالة لنفسك' },
        { status: 400 }
      )
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId: session.user.id,
        recipientId,
        adId: adId || null,
        content: content.trim(),
        isRead: false
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ad: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({ 
      message: 'تم إرسال الرسالة بنجاح',
      data: message 
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إرسال الرسالة' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول لعرض الرسائل' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const conversationWith = searchParams.get('with')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    let whereClause = {}

    if (conversationWith) {
      // Get conversation between two users
      whereClause = {
        OR: [
          { senderId: session.user.id, recipientId: conversationWith },
          { senderId: conversationWith, recipientId: session.user.id }
        ]
      }
    } else {
      // Get all messages for the user
      whereClause = {
        OR: [
          { senderId: session.user.id },
          { recipientId: session.user.id }
        ]
      }
    }

    const messages = await prisma.message.findMany({
      where: whereClause,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        ad: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    })

    const total = await prisma.message.count({ where: whereClause })

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب الرسائل' },
      { status: 500 }
    )
  }
}
