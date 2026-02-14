#!/usr/bin/env node
/**
 * 响应式图片生成脚本
 * 为图片生成多种尺寸版本，用于 srcset
 * 使用: node scripts/generate-responsive-images.js
 */

const fs = require('fs')
const path = require('path')

// 动态导入 sharp
let sharp

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images')

// 生成的目标尺寸（宽度）
const TARGET_SIZES = [320, 640, 960, 1280, 1920]

// 支持的图片格式
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.webp']

// 图片质量设置
const QUALITY = {
  jpeg: 80,
  webp: 80
}

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
      // 跳过已生成的响应式图片目录
      if (item.startsWith('responsive_')) continue
      getImageFiles(fullPath, files)
    } else if (isSupportedImage(fullPath)) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * 生成响应式图片
 */
async function generateResponsiveImages(inputPath) {
  const dir = path.dirname(inputPath)
  const ext = path.extname(inputPath)
  const basename = path.basename(inputPath, ext)

  // 检查是否是已经生成的响应式图片（避免递归生成）
  if (basename.includes('-')) {
    const suffix = basename.split('-').pop()
    if (TARGET_SIZES.includes(parseInt(suffix))) {
      return { skipped: true, reason: 'already responsive' }
    }
  }

  const results = []

  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    const originalWidth = metadata.width

    for (const width of TARGET_SIZES) {
      // 如果目标尺寸大于原图，跳过
      if (width >= originalWidth) continue

      const outputFilename = `${basename}-${width}.webp`
      const outputPath = path.join(dir, outputFilename)

      // 检查是否已存在且更新
      if (fs.existsSync(outputPath)) {
        const inputStat = fs.statSync(inputPath)
        const outputStat = fs.statSync(outputPath)
        if (outputStat.mtime >= inputStat.mtime) {
          console.log(`  ⏭️  跳过 ${width}w: ${outputFilename}`)
          results.push({ width, skipped: true })
          continue
        }
      }

      await image
        .clone()
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: QUALITY.webp, effort: 6 })
        .toFile(outputPath)

      const outputSize = fs.statSync(outputPath).size
      console.log(`  ✅ 生成 ${width}w: ${outputFilename} (${formatBytes(outputSize)})`)
      results.push({ width, size: outputSize, success: true })
    }

    // 同时生成原图的 WebP 版本（最大质量）
    const originalWebpPath = path.join(dir, `${basename}.webp`)
    if (!fs.existsSync(originalWebpPath) || 
        fs.statSync(inputPath).mtime > fs.statSync(originalWebpPath).mtime) {
      await image
        .webp({ quality: QUALITY.webp, effort: 6 })
        .toFile(originalWebpPath)
      const webpSize = fs.statSync(originalWebpPath).size
      const originalSize = fs.statSync(inputPath).size
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1)
      console.log(`  ✅ 原图 WebP: ${basename}.webp (节省 ${savings}%)`)
      results.push({ width: originalWidth, isOriginal: true, savings })
    } else {
      console.log(`  ⏭️  跳过原图 WebP: ${basename}.webp`)
    }

    return { success: true, results }
  } catch (error) {
    console.error(`  ❌ 失败:`, error.message)
    return { success: false, error: error.message }
  }
}

/**
 * 格式化字节大小
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 生成 srcset 字符串
 */
function generateSrcset(imagePath) {
  const dir = path.dirname(imagePath)
  const ext = path.extname(imagePath)
  const basename = path.basename(imagePath, ext)
  const relativeDir = path.relative(PUBLIC_IMAGES_DIR, dir)

  const srcsetParts = []

  // 添加各尺寸版本
  for (const width of TARGET_SIZES) {
    const filename = `${basename}-${width}.webp`
    const filepath = path.join(dir, filename)
    if (fs.existsSync(filepath)) {
      const urlPath = relativeDir ? `/images/${relativeDir}/${filename}` : `/images/${filename}`
      srcsetParts.push(`${urlPath} ${width}w`)
    }
  }

  // 添加原图 WebP
  const originalWebp = `${basename}.webp`
  const originalWebpPath = path.join(dir, originalWebp)
  if (fs.existsSync(originalWebpPath)) {
    const urlPath = relativeDir ? `/images/${relativeDir}/${originalWebp}` : `/images/${originalWebp}`
    srcsetParts.push(`${urlPath} ${srcsetParts.length > 0 ? '1920w' : '100vw'}`)
  }

  return srcsetParts.join(', ')
}

/**
 * 生成 sizes 属性（根据常见断点）
 */
function generateSizes() {
  return [
    '(max-width: 320px) 320px',
    '(max-width: 640px) 640px',
    '(max-width: 960px) 960px',
    '(max-width: 1280px) 1280px',
    '1920px'
  ].join(', ')
}

/**
 * 创建 srcset 配置文件
 */
function generateSrcsetConfig(imageFiles) {
  const config = {}

  for (const file of imageFiles) {
    const relativePath = path.relative(PUBLIC_IMAGES_DIR, file)
    const ext = path.extname(file)
    const basename = path.basename(file, ext)
    const dir = path.dirname(relativePath)

    const key = dir === '.' ? basename : `${dir}/${basename}`
    config[key] = {
      srcset: generateSrcset(file),
      sizes: generateSizes(),
      original: `/images/${relativePath.replace(/\\/g, '/')}`,
      webp: `/images/${dir === '.' ? '' : dir + '/'}${basename}.webp`.replace(/\\/g, '/')
    }
  }

  return config
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始生成响应式图片...\n')

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
    console.log('⚠️  public/images 目录不存在，跳过生成')
    process.exit(0)
  }

  // 获取所有图片文件
  const imageFiles = getImageFiles(PUBLIC_IMAGES_DIR)

  if (imageFiles.length === 0) {
    console.log('⚠️  未找到需要处理的图片')
    process.exit(0)
  }

  console.log(`📁 找到 ${imageFiles.length} 张图片\n`)

  // 处理每张图片
  const results = { success: 0, failed: 0, total: imageFiles.length }

  for (const file of imageFiles) {
    console.log(`🖼️  处理: ${path.relative(PUBLIC_IMAGES_DIR, file)}`)
    const result = await generateResponsiveImages(file)

    if (result.success) {
      results.success++
    } else if (result.skipped) {
      // 跳过的不计入成功或失败
    } else {
      results.failed++
    }
    console.log('')
  }

  // 生成配置文件
  console.log('📝 生成 srcset 配置文件...')
  const config = generateSrcsetConfig(imageFiles)
  const configPath = path.join(__dirname, '../public/images/srcset-config.json')
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
  console.log(`   ✅ 已保存到: public/images/srcset-config.json\n`)

  // 输出统计
  console.log('📊 处理统计:')
  console.log(`   总计: ${results.total}`)
  console.log(`   成功: ${results.success}`)
  console.log(`   失败: ${results.failed}`)
  console.log('\n✨ 完成!')
  console.log('\n💡 使用示例:')
  console.log('   import { ResponsiveImage } from "@components/WebpImage"')
  console.log('   <ResponsiveImage src="/images/photo.jpg" alt="描述" />')
}

// 运行
main().catch(console.error)
