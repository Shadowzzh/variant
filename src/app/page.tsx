'use client'

import { useEffect, useState } from 'react'
import AssetCard from '@/components/AssetCard'

type ViewportSize = 'mobile' | 'tablet' | 'desktop' | 'full'

export default function Home() {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalViewport, setGlobalViewport] = useState<ViewportSize>('full')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/assets')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFiles(data.files)
        } else {
          setError(data.error)
        }
      })
      .catch(err => {
        setError('加载失败: ' + err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const filteredFiles = files.filter(file =>
    file.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold">Variant Gallery</h1>
              <p className="text-sm text-gray-500 mt-1">
                共 {filteredFiles.length} 个设计
              </p>
            </div>

            {/* 搜索框 */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="搜索文件名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* 全局响应式控制 */}
            <div className="flex gap-2">
              {(['mobile', 'tablet', 'desktop', 'full'] as ViewportSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => setGlobalViewport(size)}
                  className={`px-4 py-2 text-sm rounded transition-colors ${
                    globalViewport === size
                      ? 'bg-black text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {size === 'mobile' && '📱 手机'}
                  {size === 'tablet' && '📱 平板'}
                  {size === 'desktop' && '💻 桌面'}
                  {size === 'full' && '🖥️ 全屏'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 - CSS Grid 3 列布局 */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
          {filteredFiles.map((file) => (
            <AssetCard
              key={file}
              filename={file}
              globalViewport={globalViewport}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500">没有找到匹配的文件</p>
          </div>
        )}
      </main>
    </div>
  )
}
