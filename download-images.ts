import axios from 'axios'
import { writeFileSync } from 'fs'
import { join } from 'path'

// Unsplash photo IDs for real estate
const realEstatePhotos = [
  'dJpupM0FLz4', // Modern apartment building
  'xMh_ww8HN_Q', // Living room interior
  'KkOUBVIMF-k', // Modern kitchen
  'R-LK3sqLiBQ', // Bedroom interior
  'zJSiQqZHfaY', // Bathroom
  'cd20yoMNJrE', // Home exterior
  'eoqnr8ikwFE', // Balcony view
  'y1cOh4wOxG8', // Modern dining room
  'DuD5D3lWC3c', // Home office
  'QnNqGoCnBg0', // Garden view
  '7ckroQOUFy8', // Living room
  'NyJJKf0pYQU', // Modern apartment
  'FV3GConVSss', // Luxurious interior
  'Z1d-LP8sjuI', // Cozy bedroom
  'JwMGy1h-JsY', // Kitchen design
  'fIq0tET6llw', // Modern bathroom
  'Zv-H9nNPCb0', // Home entrance
  'P4Wsl2Fp5eY', // Balcony furniture
  'cHayRjINnZk', // Spacious living
  'kLmt3zhwzq8'  // Home exterior view
]

// Unsplash photo IDs for cars
const carPhotos = [
  'rF1rfZw_LAA', // BMW sedan
  'jb1rF5o7lwA', // Mercedes luxury
  'YiUi00uqKnA', // Audi sports car
  'DWmjbhF1m9E', // Tesla model
  'VDbOMHkJhzY', // Classic car
  'J4-Ukh9CJfw', // SUV vehicle
  'aZBr-mKsKEE', // Sports car red
  'w2vqPNYDyKY', // White sedan
  'QrNmKHw7b8s', // Luxury interior
  'uXobNqQzGkw', // Convertible car
  'KzTHbM5-5aY', // Modern hatchback
  '1SAnrIxw5OY', // Car dashboard
  'cz63lGSPWjM', // Vintage car
  'nP7VKr3IwlM', // Electric vehicle
  'Pw_zRDDmKf4', // Car exterior
  'HWbxSLvmSww', // Jeep SUV
  '6W4F62sN_yI', // Sports motorcycle
  'x2rg_qUwJuQ', // Truck vehicle
  '1UfIl4VZCMU', // Car wheels detail
  'mcG1CtB9JqU'  // Racing car
]

async function downloadImage(photoId: string, fileName: string, folder: string) {
  try {
    const response = await axios.get(`https://source.unsplash.com/${photoId}/800x600`, {
      responseType: 'arraybuffer'
    })
    
    const imagePath = join(process.cwd(), 'public', 'images', 'ads', folder, fileName)
    writeFileSync(imagePath, response.data)
    console.log(`✅ Downloaded: ${fileName}`)
    
    // Add small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error(`❌ Failed to download ${fileName}:`, error)
  }
}

async function downloadAllImages() {
  console.log('🏠 Downloading real estate images...')
  
  for (let i = 0; i < realEstatePhotos.length; i++) {
    const fileName = `property-${i + 1}.jpg`
    await downloadImage(realEstatePhotos[i], fileName, 'real-estate')
  }
  
  console.log('🚗 Downloading car images...')
  
  for (let i = 0; i < carPhotos.length; i++) {
    const fileName = `car-${i + 1}.jpg`
    await downloadImage(carPhotos[i], fileName, 'cars')
  }
  
  console.log('🎉 All images downloaded successfully!')
}

downloadAllImages().catch(console.error)
