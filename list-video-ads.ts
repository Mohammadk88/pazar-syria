import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function listAdsWithVideos() {
  try {
    console.log('🎬 Finding ads with videos...')

    const adsWithVideos = await prisma.ad.findMany({
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

    console.log(`📹 Found ${adsWithVideos.length} ads with videos:`)
    
    adsWithVideos.forEach((ad, index) => {
      console.log(`${index + 1}. ${ad.title}`)
      console.log(`   📍 ID: ${ad.id}`)
      console.log(`   🔗 URL: http://localhost:3000/ads/${ad.id}`)
      console.log(`   🎞️ Video: ${ad.media[0]?.filePath}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error listing ads with videos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

listAdsWithVideos()
