'use client'

import { useState } from 'react'

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full'

interface AssetCardProps {
  filename: string
  globalViewport?: ViewportSize
}

// 卡片固定尺寸
const CARD_WIDTH = 400
const CARD_HEIGHT = 300

// 原始页面尺寸（用于缩放计算）
const ORIGINAL_WIDTH = 1440
const ORIGINAL_HEIGHT = 900

const viewportSizes = {
  mobile: { width: 375, height: 667, label: '手机' },
  tablet: { width: 768, height: 1024, label: '平板' },
  desktop: { width: 1440, height: 900, label: '桌面' },
  full: { width: CARD_WIDTH, height: CARD_HEIGHT, label: '全屏' }
}

export default function AssetCard({ filename, globalViewport = 'full' }: AssetCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 使用全局 viewport 设置
  const currentSize = viewportSizes[globalViewport]

  // 计算缩放比例
  const scale = Math.min(
    CARD_WIDTH / currentSize.width,
    CARD_HEIGHT / currentSize.height
  )

  // 计算缩放后的实际显示尺寸
  const scaledWidth = currentSize.width * scale
  const scaledHeight = currentSize.height * scale

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
      {/* 卡片头部 */}
      <div className="px-4 py-3 border-b bg-gray-50">
        <h3 className="font-semibold text-sm truncate" title={filename}>
          {filename}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {currentSize.width} × {currentSize.height}
        </p>
      </div>

      {/* iframe 预览区域 - 使用 transform scale 缩放 */}
      <div
        className="bg-gray-100 flex items-center justify-center relative"
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT
        }}
      >
        <div
          className="bg-white shadow-inner"
          style={{
            width: scaledWidth,
            height: scaledHeight,
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <iframe
            src={`/assets/${filename}`}
            title={filename}
            sandbox="allow-scripts allow-same-origin"
            className="border-0"
            style={{
              width: currentSize.width,
              height: currentSize.height,
              transform: `scale(${scale})`,
              transformOrigin: '0 0',
              border: 'none'
            }}
          />
        </div>
      </div>

      {/* 底部操作栏 */}
      <div className="px-4 py-2 border-t bg-gray-50 flex gap-3 text-xs">
        <a
          href={`/assets/${filename}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-black transition-colors"
        >
          新窗口打开
        </a>
      </div>
    </div>
  )
}
