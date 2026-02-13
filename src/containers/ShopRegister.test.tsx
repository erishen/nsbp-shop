/**
 * ShopRegister 组件测试
 */

describe('ShopRegister 组件', () => {
  it('文件应该存在', () => {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(__dirname, 'ShopRegister.tsx')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
