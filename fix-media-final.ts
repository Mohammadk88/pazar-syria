import { prisma } from './src/lib/prisma'

async function fixMediaIssues() {
  console.log('🔧 Fixing media issues in database...')

  try {
    // Update all media to have proper type field
    console.log('📸 Setting media types...')
    
    // Set image types
    await prisma.adMedia.updateMany({
      where: {
        filePath: {
          endsWith: '.jpg'
        }
      },
      data: {
        fileType: 'IMAGE'
      }
    })

    await prisma.adMedia.updateMany({
      where: {
        filePath: {
          endsWith: '.png'
        }
      },
      data: {
        fileType: 'IMAGE'
      }
    })

    // Set video types
    await prisma.adMedia.updateMany({
      where: {
        filePath: {
          endsWith: '.mp4'
        }
      },
      data: {
        fileType: 'VIDEO'
      }
    })

    await prisma.adMedia.updateMany({
      where: {
        filePath: {
          endsWith: '.webm'
        }
      },
      data: {
        fileType: 'VIDEO'
      }
    })

    console.log('✅ Media types updated')

    // Check and fix duplicate primary images
    console.log('🔍 Checking for primary image issues...')
    
    const ads = await prisma.ad.findMany({
      include: {
        media: true
      }
    })

    for (const ad of ads) {
      const primaryMedia = ad.media.filter(m => m.isPrimary)
      
      if (primaryMedia.length === 0) {
        // No primary media, set first media as primary
        const firstMedia = ad.media[0]
        if (firstMedia) {
          await prisma.adMedia.update({
            where: { id: firstMedia.id },
            data: { isPrimary: true }
          })
          console.log(`🔧 Set primary media for ad: ${ad.title}`)
        }
      } else if (primaryMedia.length > 1) {
        // Multiple primary media, keep only the first one
        for (let i = 1; i < primaryMedia.length; i++) {
          await prisma.adMedia.update({
            where: { id: primaryMedia[i].id },
            data: { isPrimary: false }
          })
        }
        console.log(`🔧 Fixed multiple primary media for ad: ${ad.title}`)
      }
    }

    console.log('✅ Primary media issues fixed')

    // Check final state
    const finalCheck = await prisma.ad.findMany({
      include: {
        media: true,
        category: true
      },
      take: 3
    })

    console.log('📊 Final check - first 3 ads:')
    finalCheck.forEach(ad => {
      console.log(`${ad.title} (${ad.category.nameAr}):`)
      console.log(`  Media count: ${ad.media.length}`)
      ad.media.forEach(m => {
        console.log(`  - ${m.filePath} (primary: ${m.isPrimary}, type: ${m.fileType})`)
      })
      console.log()
    })

  } catch (error) {
    console.error('❌ Error fixing media:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixMediaIssues()
