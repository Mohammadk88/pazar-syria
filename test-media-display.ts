import { prisma } from './src/lib/prisma.js'

async function testMediaDisplay() {
  console.log('🔍 فحص عرض الوسائط...')

  try {
    // جلب أول 5 إعلانات مع الوسائط
    const ads = await prisma.ad.findMany({
      take: 5,
      include: {
        media: true,
        user: {
          include: {
            profile: true
          }
        },
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('📊 الإعلانات المعروضة:')
    
    for (const ad of ads) {
      console.log(`\n📝 الإعلان: ${ad.title}`)
      console.log(`📂 الفئة: ${ad.category.nameAr}`)
      console.log(`📸 عدد الوسائط: ${ad.media.length}`)
      
      if (ad.media.length > 0) {
        const images = ad.media.filter(m => m.fileType === 'IMAGE')
        const videos = ad.media.filter(m => m.fileType === 'VIDEO')
        
        console.log(`   🖼️  الصور: ${images.length}`)
        console.log(`   🎥 الفيديوهات: ${videos.length}`)
        
        // عرض مسارات الوسائط
        ad.media.forEach((media, index) => {
          console.log(`   ${index + 1}. ${media.fileType}: ${media.filePath}`)
        })
      } else {
        console.log('   ⚠️  لا توجد وسائط مرفقة')
      }
    }

    // فحص إحصائيات عامة
    const totalAds = await prisma.ad.count()
    const adsWithMedia = await prisma.ad.count({
      where: {
        media: {
          some: {}
        }
      }
    })
    const totalMedia = await prisma.adMedia.count()
    const totalImages = await prisma.adMedia.count({
      where: { fileType: 'IMAGE' }
    })
    const totalVideos = await prisma.adMedia.count({
      where: { fileType: 'VIDEO' }
    })

    console.log('\n📈 الإحصائيات العامة:')
    console.log(`- إجمالي الإعلانات: ${totalAds}`)
    console.log(`- إعلانات بوسائط: ${adsWithMedia}`)
    console.log(`- إجمالي الوسائط: ${totalMedia}`)
    console.log(`- الصور: ${totalImages}`)
    console.log(`- الفيديوهات: ${totalVideos}`)

  } catch (error) {
    console.error('❌ خطأ في فحص البيانات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testMediaDisplay()
