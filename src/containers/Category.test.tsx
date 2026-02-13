/**
 * Category 组件测试
 */

describe('Category 组件', () => {
  it('文件应该存在', () => {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, 'Category.tsx')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
