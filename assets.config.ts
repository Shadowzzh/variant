/**
 * Device configuration for thumbnail generation
 *
 * Rules:
 * 1. Check this config first for explicit device assignment
 * 2. Fall back to filename keyword detection
 * 3. Default to 'desktop' if no match
 */

export type DeviceType = 'mobile' | 'tablet' | 'desktop'
export type DeviceConfig = DeviceType | { width: number; height: number }

// Device viewport sizes (original design sizes)
export const DEVICE_SIZES = {
  mobile: { width: 375, height: 667, label: 'mobile' },
  tablet: { width: 768, height: 1024, label: 'tablet' },
  desktop: { width: 1440, height: 900, label: 'desktop' },
} as const

// Keyword patterns for auto-detection
const DEVICE_KEYWORDS: Record<DeviceType, string[]> = {
  mobile: ['mobile', 'phone', 'android', 'ios', 'iphone'],
  tablet: ['tablet', 'ipad'],
  desktop: ['desktop', 'pc', 'mac'],
}

// Explicit overrides for specific files
export const ASSETS_CONFIG: Record<string, DeviceConfig> = {
  // Add specific file overrides here
  // 'some-file.html': 'mobile',
  // 'another-file.html': { width: 1280, height: 720 },
}

/**
 * Detect device type from filename
 */
export function detectDevice(filename: string): DeviceType {
  // 1. Check explicit config
  const override = ASSETS_CONFIG[filename]
  if (override) {
    if (typeof override === 'string') {
      return override
    }
    // Custom size, map to nearest device type
    const ratio = override.width / override.height
    if (ratio < 0.6) return 'mobile'
    if (ratio < 0.9) return 'tablet'
    return 'desktop'
  }

  // 2. Check filename keywords
  const lower = filename.toLowerCase()

  for (const [device, keywords] of Object.entries(DEVICE_KEYWORDS)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      return device as DeviceType
    }
  }

  // 3. Default to desktop
  return 'desktop'
}

/**
 * Get thumbnail dimensions for a device
 * Width is fixed at 800, height scales to maintain aspect ratio
 */
export function getThumbnailDimensions(device: DeviceType): { width: number; height: number } {
  const size = DEVICE_SIZES[device]
  const thumbnailWidth = 800
  const aspectRatio = size.width / size.height
  const thumbnailHeight = Math.round(thumbnailWidth / aspectRatio)

  return { width: thumbnailWidth, height: thumbnailHeight }
}
