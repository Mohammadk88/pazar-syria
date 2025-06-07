import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Sample video URLs (using placeholder videos)
const sampleVideos = [
  'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4'
]

async function addSampleVideos() {
  try {
    console.log('🎬 Adding sample videos to existing ads...')

    // Get some random ads
    const ads = await prisma.ad.findMany({
      take: 5,
      include: {
        media: true
      }
    })

    for (let i = 0; i < ads.length && i < sampleVideos.length; i++) {
      const ad = ads[i]
      const videoUrl = sampleVideos[i]

      // Add a video to this ad
      await prisma.adMedia.create({
        data: {
          adId: ad.id,
          filePath: videoUrl,
          fileType: 'VIDEO',
          isPrimary: false,
          sortOrder: (ad.media.length || 0) + 1
        }
      })

      console.log(`✅ Added video to ad: ${ad.title}`)
    }

    console.log('🎉 Successfully added sample videos!')
  } catch (error) {
    console.error('❌ Error adding sample videos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addSampleVideos()
