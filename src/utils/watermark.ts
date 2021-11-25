type Option = {
  deg: number
  size: number
  radio: number
  text: string
  color: string
}
const options = {
  deg: -20,
  size: 30,
  radio: 0,
  text: '驺虞',
  color: '#999'
}
interface styles {
  [s: string]: string
}

const divStyle: styles = {
  position: 'fixed',
  top: '0px',
  left: '0px',
  zIndex: '99999999',
  width: '100vw',
  height: '100vh',
  positionEvent: 'none'
}

// 删除水印
export function remove() {
  const watermark = document.getElementById('watermark')
  watermark && document.getElementsByTagName('body')[0].removeChild(watermark)
}
// 创建水印
export function create(option?: Option) {
  // 删除之前的水印，合并配置
  remove()
  Object.assign(options, option)

  // 创建dom
  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const cw = options.size * 6
  const ch = options.size * 4
  canvas.width = cw * dpr
  canvas.height = ch * dpr
  // 获取canvas实例
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    console.error('canvas 获取实例失败')
    return
  }
  // 绘制背景
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, cw, ch)
  ctx.save()
  // 旋转文字
  ctx.translate(cw / 2, ch / 2)
  ctx.rotate((Math.PI / 180) * options.deg)
  ctx.font = options.size + 'px 黑体'
  ctx.fillStyle = options.color
  ctx.fillText(options.text, -ctx.measureText(options.text).width / 2, options.size / 2)
  ctx.translate(-(cw / 2), -(ch / 2))
  // 创建div
  const div = document.createElement('div')
  document.getElementsByTagName('body')[0].append(div)
  // 添加样式
  let d: string
  for (d in divStyle) {
    ;(div.style as CSSStyleDeclaration & { [s: string]: string })[d] = divStyle[d]
  }
  // 给div添加canvas背景
  div.style.background = `rgba(0,0,0,${options.radio / 100}) url(${canvas.toDataURL(
    'image/png'
  )}) left top repeat`
  div.setAttribute('id', 'watermark')
}
