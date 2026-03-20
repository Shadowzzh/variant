import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface AssetInfo {
  filename: string
  thumbnail: string | null
}

export async function GET() {
  try {
    const assetsDir = path.join(process.cwd(), 'public', 'assets')
    const thumbnailsDir = path.join(process.cwd(), 'public', 'thumbnails')

    // Read HTML files
    const files = fs.readdirSync(assetsDir)
    const htmlFiles = files.filter(file => file.endsWith('.html')).sort()

    // Check for existing thumbnails
    const assets: AssetInfo[] = htmlFiles.map(filename => {
      const thumbnailFilename = filename.replace('.html', '.webp')
      const thumbnailPath = path.join(thumbnailsDir, thumbnailFilename)
      const hasThumbnail = fs.existsSync(thumbnailPath)

      return {
        filename,
        thumbnail: hasThumbnail ? `/thumbnails/${thumbnailFilename}` : null,
      }
    })

    return NextResponse.json({
      success: true,
      assets,
      total: assets.length,
    })
  } catch (error) {
    console.error('Error reading assets directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read assets directory' },
      { status: 500 }
    )
  }
}
