import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateVideoPath() {
  try {
    console.log('🎬 Updating video path to use local test video...')

    // Find an ad with a video
    const adWithVideo = await prisma.ad.findFirst({
      include: {
        media: {
          where: {
            fileType: 'VIDEO'
          }
        }
      },
      where: {
        media: {
          some: {
            fileType: 'VIDEO'
          }
        }
      }
    })

    if (!adWithVideo || !adWithVideo.media[0]) {
      console.log('❌ No ad with video found')
      return
    }

    // Update to use a simple video URL that works
    await prisma.adMedia.update({
      where: {
        id: adWithVideo.media[0].id
      },
      data: {
        filePath: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    })

    console.log(`✅ Updated video for ad: ${adWithVideo.title}`)
    console.log(`📹 Ad ID: ${adWithVideo.id}`)
  } catch (error) {
    console.error('❌ Error updating video path:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateVideoPath()
