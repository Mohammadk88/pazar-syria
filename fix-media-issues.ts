import { prisma } from './src/lib/prisma.js'

async function fixMediaIssues() {
  console.log('🔧 إصلاح مشاكل الصور والفيديوهات...')

  try {
    // 1. فحص الإعلانات الحالية
    const ads = await prisma.ad.findMany({
      include: {
        media: true,
        category: true
      }
    })

    console.log(`📊 تم العثور على ${ads.length} إعلان`)

    // 2. حذف البيانات الإعلامية المعطوبة
    console.log('🗑️ حذف البيانات الإعلامية القديمة...')
    await prisma.adMedia.deleteMany({})

    // 3. إضافة صور وفيديوهات جديدة
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

    const sampleVideos = [
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
    ]

    let videoIndex = 0

    for (const ad of ads) {
      let imagesToUse: string[] = []
      
      // اختيار الصور حسب الفئة
      if (ad.category.nameEn === 'Real Estate') {
        imagesToUse = realEstateImages
      } else if (ad.category.nameEn === 'Cars') {
        imagesToUse = carImages
      }

      // إضافة 2-4 صور لكل إعلان
      const numImages = Math.floor(Math.random() * 3) + 2 // 2-4 صور
      const selectedImages: string[] = []
      
      for (let i = 0; i < numImages; i++) {
        const randomImage = imagesToUse[Math.floor(Math.random() * imagesToUse.length)]
        if (!selectedImages.includes(randomImage)) {
          selectedImages.push(randomImage)
        }
      }

      // إضافة الصور
      for (let i = 0; i < selectedImages.length; i++) {
        await prisma.adMedia.create({
          data: {
            adId: ad.id,
            filePath: selectedImages[i],
            fileName: `image-${i + 1}.jpg`,
            fileType: 'IMAGE',
            fileSize: Math.floor(Math.random() * 500000) + 100000, // 100KB - 600KB
            sortOrder: i + 1,
            isPrimary: i === 0 // الصورة الأولى هي الرئيسية
          }
        })
      }

      // إضافة فيديو لبعض الإعلانات (50% احتمالية)
      if (Math.random() > 0.5 && videoIndex < sampleVideos.length) {
        await prisma.adMedia.create({
          data: {
            adId: ad.id,
            filePath: sampleVideos[videoIndex],
            fileName: `video-${videoIndex + 1}.mp4`,
            fileType: 'VIDEO',
            fileSize: Math.floor(Math.random() * 5000000) + 2000000, // 2MB - 7MB
            sortOrder: selectedImages.length + 1,
            isPrimary: false
          }
        })
        videoIndex++
      }

      console.log(`✅ تم تحديث الإعلان: ${ad.title} - ${selectedImages.length} صور ${videoIndex <= sampleVideos.length && Math.random() > 0.5 ? '+ فيديو' : ''}`)
    }

    // 4. فحص النتائج
    const updatedAds = await prisma.ad.findMany({
      include: {
        media: true
      }
    })

    const totalMedia = await prisma.adMedia.count()
    const totalImages = await prisma.adMedia.count({
      where: { fileType: 'IMAGE' }
    })
    const totalVideos = await prisma.adMedia.count({
      where: { fileType: 'VIDEO' }
    })

    console.log('📈 النتائج النهائية:')
    console.log(`- إجمالي الملفات الإعلامية: ${totalMedia}`)
    console.log(`- إجمالي الصور: ${totalImages}`)
    console.log(`- إجمالي الفيديوهات: ${totalVideos}`)
    console.log(`- عدد الإعلانات المحدثة: ${updatedAds.length}`)

    console.log('🎉 تم إصلاح جميع مشاكل الصور والفيديوهات بنجاح!')

  } catch (error) {
    console.error('❌ خطأ في إصلاح البيانات:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixMediaIssues()
