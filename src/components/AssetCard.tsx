'use client'

import { useState } from 'react'

interface AssetCardProps {
  filename: string
  thumbnail: string | null
}

// Generate gradient based on filename (consistent color per file)
function getGradientFromFilename(filename: string): string {
  let hash = 0
  for (let i = 0; i < filename.length; i++) {
    hash = filename.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue1 = Math.abs(hash % 360)
  const hue2 = (hue1 + 40) % 360
  return `linear-gradient(135deg, hsl(${hue1}, 70%, 80%), hsl(${hue2}, 70%, 70%))`
}

export default function AssetCard({ filename, thumbnail }: AssetCardProps) {
  const [imageError, setImageError] = useState(false)

  // Remove .html extension for display
  const displayName = filename.replace('.html', '')
  const assetUrl = `/assets/${filename}`

  return (
    <a href={assetUrl} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="border rounded-lg overflow-hidden bg-white cursor-pointer transition-shadow hover:shadow-lg">
        {/* Preview area */}
        <div
          className="relative w-full aspect-[4/3] bg-gray-100"
          style={{
            background: thumbnail && !imageError ? undefined : getGradientFromFilename(filename),
          }}
        >
          {thumbnail && !imageError ? (
            <img
              src={thumbnail}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white/80 text-lg font-medium drop-shadow-sm">
                {displayName}
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-black px-4 py-2 rounded-full text-sm font-medium shadow-lg transition-opacity">
              在新标签页打开
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t bg-white">
          <h3 className="font-medium text-sm truncate" title={filename}>
            {displayName}
          </h3>
        </div>
      </div>
    </a>
  )
}
