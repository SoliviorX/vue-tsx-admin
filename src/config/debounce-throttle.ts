let timer: any
// 只执行一次，初始值为true
let debounceOnly: boolean = true

/**
 * 防抖
 * @param callback 回调函数
 * @param time 间隔时间
 * @param arg 参数
 * @param immediate 开始时还是结束时；默认false：表示结束时；true表示开始时
 */
export const debounce = (
  callback: Function,
  time?: number,
  arg?: any[],
  immediate?: boolean
): Function | void => {
  const args = arg ? arg : []
  // 如果开始时立即执行，且debounceOnly为true
  if (immediate && debounceOnly) {
    debounceOnly = false
    callback(...args)
  }
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    callback(...args)
  }, time || 300)
}

let bol: boolean = true
// 只执行一次
let throttleOnly: boolean = true
/**
 * 节流
 * @param callback
 * @param time
 * @param arg
 * @param immediate
 */
export const throttle = (
  callback: Function,
  time?: number,
  arg?: any[],
  immediate?: boolean
): Function | void => {
  const args = arg ? arg : []
  if (immediate && throttleOnly) {
    throttleOnly = false
    return callback(...args)
  }

  if (bol) {
    bol = false
    setTimeout(() => {
      bol = true
      return callback(...args)
    }, time || 300)
  }
}
