import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function addVideoToAds() {
  try {
    // Get some existing ads
    const ads = await prisma.ad.findMany({
      where: {
        categoryId: {
          in: ['clm1a2b3c4d5e6f7g8h9i0j1k', 'clm1a2b3c4d5e6f7g8h9i0j1l'] // Real estate and cars
        }
      },
      take: 5,
      include: {
        media: true
      }
    });

    console.log(`Found ${ads.length} ads to add videos to`);

    // Create sample video directory if not exists
    const videoDir = path.join(process.cwd(), 'public', 'videos', 'sample');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    // Mock video files (you can replace these with actual video files)
    const sampleVideos = [
      'house-tour.mp4',
      'apartment-view.mp4', 
      'car-engine.mp4',
      'car-interior.mp4',
      'property-walkthrough.mp4'
    ];

    // Create placeholder video files if they don't exist
    for (const videoFile of sampleVideos) {
      const videoPath = path.join(videoDir, videoFile);
      if (!fs.existsSync(videoPath)) {
        // Create a small dummy file to represent the video
        fs.writeFileSync(videoPath, 'dummy video content');
        console.log(`Created placeholder video: ${videoFile}`);
      }
    }

    // Add videos to ads
    for (let i = 0; i < ads.length && i < sampleVideos.length; i++) {
      const ad = ads[i];
      const videoFile = sampleVideos[i];
      const videoPath = `/videos/sample/${videoFile}`;

      // Add video media to the ad
      await prisma.adMedia.create({
        data: {
          adId: ad.id,
          filePath: videoPath,
          fileType: 'VIDEO',
          isPrimary: false,
          sortOrder: (ad.media?.length || 0) + 1
        }
      });

      console.log(`Added video ${videoFile} to ad: ${ad.title}`);
    }

    console.log('✅ Successfully added videos to sample ads!');

  } catch (error) {
    console.error('❌ Error adding videos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addVideoToAds();
