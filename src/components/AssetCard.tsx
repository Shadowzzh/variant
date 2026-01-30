'use client'

import { useEffect, useRef, useState } from 'react'

type ViewportSize = 'mobile' | 'tablet' | 'desktop'

interface AssetCardProps {
  filename: string
  globalViewport?: ViewportSize
}

// 卡片默认尺寸（初始值，会被动态值覆盖）
const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 300

const viewportSizes = {
  mobile: { width: 375, height: 667, label: '手机' },
  tablet: { width: 768, height: 1024, label: '平板' },
  desktop: { width: 1440, height: 900, label: '桌面' },
}

export default function AssetCard({ filename, globalViewport = 'desktop' }: AssetCardProps) {
  const [containerWidth, setContainerWidth] = useState(DEFAULT_WIDTH)
  const [containerHeight, setContainerHeight] = useState(DEFAULT_HEIGHT)
  const containerRef = useRef<HTMLDivElement>(null)

  // 使用 ResizeObserver 监听容器尺寸变化
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setContainerWidth(width)
      setContainerHeight(height)
    })

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  // 使用全局 viewport 设置
  const currentSize = viewportSizes[globalViewport]

  // 计算缩放比例
  const scale = Math.min(containerWidth / currentSize.width, containerHeight / currentSize.height)

  // 计算缩放后的实际显示尺寸
  const scaledWidth = currentSize.width * scale
  const scaledHeight = currentSize.height * scale

  return (
    <a
      href={`/assets/${filename}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div className="border rounded-lg bg-white overflow-hidden flex flex-col cursor-pointer">
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
          ref={containerRef}
          className="bg-gray-100 flex items-center justify-center relative w-full"
          style={{
            minHeight: '300px', // 最小高度，实际高度由 ResizeObserver 获取
          }}
        >
          <div
            className="bg-white shadow"
            style={{
              width: scaledWidth,
              height: scaledHeight,
              overflow: 'hidden',
              position: 'relative',
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
                border: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </a>

  )
}
