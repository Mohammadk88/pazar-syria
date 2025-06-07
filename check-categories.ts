import { prisma } from './src/lib/prisma.js'

async function checkCategories() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        nameAr: true,
        nameEn: true,
        slug: true,
        _count: {
          select: {
            ads: true
          }
        }
      }
    })

    console.log('📂 الفئات الموجودة:')
    categories.forEach(cat => {
      console.log(`- ${cat.nameAr} (${cat.nameEn}) - slug: "${cat.slug}" - إعلانات: ${cat._count.ads}`)
    })

  } catch (error) {
    console.error('خطأ:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCategories()
