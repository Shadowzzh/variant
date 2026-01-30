import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const assetsDir = path.join(process.cwd(), 'public', 'assets')

    // 读取目录中的所有文件
    const files = fs.readdirSync(assetsDir)

    // 过滤出 HTML 文件并排序
    const htmlFiles = files
      .filter(file => file.endsWith('.html'))
      .sort()

    return NextResponse.json({
      success: true,
      files: htmlFiles,
      total: htmlFiles.length
    })
  } catch (error) {
    console.error('Error reading assets directory:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to read assets directory' },
      { status: 500 }
    )
  }
}
