import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugAdsImages() {
  console.log('🔍 فحص الإعلانات مع الوسائط...')
  
  // Get first 5 ads with media
  const ads = await prisma.ad.findMany({
    take: 5,
    include: {
      media: {
        orderBy: { sortOrder: 'asc' }
      },
      category: true
    },
    orderBy: { createdAt: 'desc' }
  })

  ads.forEach((ad, index) => {
    console.log(`\n📝 الإعلان ${index + 1}: ${ad.title}`)
    console.log(`📂 الفئة: ${ad.category.nameAr}`)
    console.log(`📸 عدد الوسائط: ${ad.media.length}`)
    
    ad.media.forEach((media, mediaIndex) => {
      console.log(`   ${mediaIndex + 1}. ${media.fileType}: ${media.filePath} ${media.isPrimary ? '(أساسية)' : ''}`)
    })

    // Test the image URL logic from ads page
    const primaryImage = ad.media.find(m => m.isPrimary && m.fileType === 'IMAGE')
    const firstImage = ad.media.find(m => m.fileType === 'IMAGE')
    const finalImage = primaryImage?.filePath || firstImage?.filePath || ad.media[0]?.filePath || '/placeholder-ad.jpg'
    
    console.log(`🖼️  الصورة المختارة: ${finalImage}`)
  })

  await prisma.$disconnect()
}

debugAdsImages().catch(console.error)
