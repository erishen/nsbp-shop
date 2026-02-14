/**
 * OrderDetail 组件测试
 */

describe('OrderDetail 组件', () => {
  it('文件应该存在', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs')
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path')
    const filePath = path.join(__dirname, 'OrderDetail.tsx')
    expect(fs.existsSync(filePath)).toBe(true)
  })
})
