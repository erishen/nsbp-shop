#!/usr/bin/env node
/**
 * WebP 图片转换脚本
 * 将 public/images 下的所有图片转换为 WebP 格式
 * 使用: node scripts/convert-to-webp.js
 */

const fs = require('fs')
const path = require('path')

// 动态导入 sharp (ESM 模块)
let sharp

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images')

// 支持的图片格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png']

// 转换质量设置
const QUALITY = 80

/**
 * 检查文件是否为支持的图片格式
 */
function isSupportedImage(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return SUPPORTED_FORMATS.includes(ext)
}

/**
 * 递归获取目录下所有图片文件
 */
function getImageFiles(dir, files = []) {
  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      getImageFiles(fullPath, files)
    } else if (isSupportedImage(fullPath)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * 转换单张图片为 WebP
 */
async function convertToWebP(inputPath) {
  const outputPath = inputPath.replace(/\.(jpg|jpeg|png)$/i, '.webp')

  // 如果 WebP 已存在且更新，跳过
  if (fs.existsSync(outputPath)) {
    const inputStat = fs.statSync(inputPath)
    const outputStat = fs.statSync(outputPath)

    if (outputStat.mtime >= inputStat.mtime) {
      console.log(`⏭️  跳过: ${path.relative(PUBLIC_IMAGES_DIR, inputPath)}`)
      return { skipped: true }
    }
  }

  try {
    await sharp(inputPath)
      .webp({ quality: QUALITY, effort: 6 })
      .toFile(outputPath)

    const inputSize = fs.statSync(inputPath).size
    const outputSize = fs.statSync(outputPath).size
    const savings = ((inputSize - outputSize) / inputSize * 100).toFixed(1)

    console.log(
      `✅ 转换: ${path.relative(PUBLIC_IMAGES_DIR, inputPath)} ` +
      `(${formatBytes(inputSize)} → ${formatBytes(outputSize)}, 节省 ${savings}%)`
    )

    return { success: true, savings: parseFloat(savings) }
  } catch (error) {
    console.error(`❌ 失败: ${path.relative(PUBLIC_IMAGES_DIR, inputPath)}`, error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始转换图片为 WebP 格式...\n')

  // 动态导入 sharp
  try {
    const sharpModule = await import('sharp')
    sharp = sharpModule.default
  } catch (error) {
    console.error('❌ 请确保已安装 sharp: pnpm add -D sharp')
    process.exit(1)
  }

  // 检查目录是否存在
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.log('⚠️  public/images 目录不存在，跳过转换')
    process.exit(0)
  }

  // 获取所有图片文件
  const imageFiles = getImageFiles(PUBLIC_IMAGES_DIR)

  if (imageFiles.length === 0) {
    console.log('⚠️  未找到需要转换的图片')
    process.exit(0)
  }

  console.log(`📁 找到 ${imageFiles.length} 张图片\n`)

  // 转换所有图片
  const results = { success: 0, skipped: 0, failed: 0, totalSavings: 0 }

  for (const file of imageFiles) {
    const result = await convertToWebP(file)

    if (result.skipped) {
      results.skipped++
    } else if (result.success) {
      results.success++
      results.totalSavings += result.savings || 0
    } else {
      results.failed++
    }
  }

  // 输出统计
  console.log('\n📊 转换统计:')
  console.log(`   成功: ${results.success}`)
  console.log(`   跳过: ${results.skipped}`)
  console.log(`   失败: ${results.failed}`)

  if (results.success > 0) {
    const avgSavings = (results.totalSavings / results.success).toFixed(1)
    console.log(`   平均节省: ${avgSavings}%`)
  }

  console.log('\n✨ 完成!')
}

// 运行
main().catch(console.error)
