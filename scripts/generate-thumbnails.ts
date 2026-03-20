/**
 * Generate thumbnails for all HTML files in public/assets/
 *
 * Usage: npm run thumbnails
 *
 * Config:
 * - Size: 800×600
 * - Format: WebP
 * - Viewport: 1440×900 (desktop)
 * - Wait: networkidle
 */

import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets')
const THUMBNAILS_DIR = path.join(process.cwd(), 'public', 'thumbnails')

// Thumbnail config - viewport matches screenshot size for full capture
const VIEWPORT_WIDTH = 800
const VIEWPORT_HEIGHT = 600

/**
 * Get all HTML files from assets directory
 */
function getHtmlFiles(): string[] {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Assets directory not found: ${ASSETS_DIR}`)
    return []
  }

  const files = fs.readdirSync(ASSETS_DIR)
  return files.filter(file => file.endsWith('.html')).sort()
}

/**
 * Generate thumbnail for a single HTML file
 */
async function generateThumbnail(filename: string): Promise<boolean> {
  const htmlPath = path.join(ASSETS_DIR, filename)
  const thumbnailFilename = filename.replace('.html', '.webp')
  const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailFilename)

  // File URL for Puppeteer
  const fileUrl = `file://${htmlPath}`

  console.log(`Generating: ${filename}...`)

  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
    })

    const page = await browser.newPage()

    // Set viewport to desktop size
    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    })

    // Navigate to page and wait for network idle
    await page.goto(fileUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    })

    // Wait a bit more for any animations
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Take screenshot (captures full viewport)
    await page.screenshot({
      path: thumbnailPath,
      type: 'webp',
    })

    console.log(`  ✓ Saved: ${thumbnailFilename}`)
    return true
  } catch (error) {
    console.error(`  ✗ Failed: ${filename}`, error instanceof Error ? error.message : error)
    return false
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🖼  Generating thumbnails...\n')
  console.log(`Assets: ${ASSETS_DIR}`)
  console.log(`Output: ${THUMBNAILS_DIR}\n`)

  // Ensure thumbnails directory exists
  if (!fs.existsSync(THUMBNAILS_DIR)) {
    fs.mkdirSync(THUMBNAILS_DIR, { recursive: true })
  }

  const htmlFiles = getHtmlFiles()

  if (htmlFiles.length === 0) {
    console.log('No HTML files found.')
    return
  }

  console.log(`Found ${htmlFiles.length} HTML file(s)\n`)

  let successCount = 0
  let failCount = 0

  // Generate thumbnails sequentially (safer for memory)
  for (const file of htmlFiles) {
    const success = await generateThumbnail(file)
    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log('\n' + '='.repeat(40))
  console.log(`Done! ${successCount} succeeded, ${failCount} failed`)
  console.log('='.repeat(40))
}

main().catch(console.error)
