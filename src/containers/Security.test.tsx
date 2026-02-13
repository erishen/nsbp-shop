/**
 * Security 组件测试
 */

describe('Security 组件', () => {
  it('文件应该存在', () => {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, 'Security.tsx')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
