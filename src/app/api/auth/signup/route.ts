import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password, profileType, companyName } = await request.json()

    // Validation
    if (!name || !email || !password || !profileType) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phone: phone }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "البريد الإلكتروني أو رقم الهاتف مستخدم بالفعل" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user with profile
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        profile: {
          create: {
            type: profileType,
            companyName: profileType === "COMPANY" ? companyName : null
          }
        }
      },
      include: {
        profile: true
      }
    })

    // Remove password from response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: "تم إنشاء الحساب بنجاح",
        user: userWithoutPassword
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}
