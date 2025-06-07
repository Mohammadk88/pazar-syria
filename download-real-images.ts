import fs from 'fs'
import path from 'path'

// High-quality images for real estate
const realEstateImages = [
  {
    url: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&h=900&fit=crop&auto=format',
    name: 'apartment-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200&h=900&fit=crop&auto=format',
    name: 'apartment-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=1200&h=900&fit=crop&auto=format',
    name: 'apartment-3.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&h=900&fit=crop&auto=format',
    name: 'apartment-4.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1200&h=900&fit=crop&auto=format',
    name: 'villa-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1552558634-ba21954b26af?w=1200&h=900&fit=crop&auto=format',
    name: 'villa-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=1200&h=900&fit=crop&auto=format',
    name: 'house-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=900&fit=crop&auto=format',
    name: 'house-2.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&h=900&fit=crop&auto=format',
    name: 'kitchen-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=1200&h=900&fit=crop&auto=format',
    name: 'bathroom-1.jpg'
  }
]

// High-quality images for cars
const carImages = [
  {
    url: 'https://images.unsplash.com/photo-1494905998402-395d579af36f?w=1200&h=900&fit=crop&auto=format',
    name: 'bmw-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1469285994282-454ceb49e63c?w=1200&h=900&fit=crop&auto=format',
    name: 'mercedes-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1200&h=900&fit=crop&auto=format',
    name: 'audi-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&h=900&fit=crop&auto=format',
    name: 'toyota-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&h=900&fit=crop&auto=format',
    name: 'honda-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=1200&h=900&fit=crop&auto=format',
    name: 'hyundai-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&h=900&fit=crop&auto=format',
    name: 'kia-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1200&h=900&fit=crop&auto=format',
    name: 'nissan-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=900&fit=crop&auto=format',
    name: 'porsche-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&h=900&fit=crop&auto=format',
    name: 'lexus-1.jpg'
  }
]

async function downloadImage(url: string, filepath: string): Promise<void> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to fetch ${url}`)
    
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await fs.promises.writeFile(filepath, buffer)
    console.log(`✅ Downloaded: ${path.basename(filepath)}`)
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error)
  }
}

async function main() {
  console.log('🚀 Starting image download...')
  
  // Create directories
  const realEstateDir = path.join(process.cwd(), 'public', 'images', 'ads', 'real-estate')
  const carsDir = path.join(process.cwd(), 'public', 'images', 'ads', 'cars')
  
  await fs.promises.mkdir(realEstateDir, { recursive: true })
  await fs.promises.mkdir(carsDir, { recursive: true })
  
  // Download real estate images
  console.log('\n📷 Downloading real estate images...')
  for (const image of realEstateImages) {
    const filepath = path.join(realEstateDir, image.name)
    await downloadImage(image.url, filepath)
    // Add small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Download car images
  console.log('\n🚗 Downloading car images...')
  for (const image of carImages) {
    const filepath = path.join(carsDir, image.name)
    await downloadImage(image.url, filepath)
    // Add small delay to be respectful to the API
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  console.log('\n✅ All images downloaded successfully!')
}

main().catch(console.error)
