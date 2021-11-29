import type { App } from 'vue'

interface obj {
  arg: string
  funVal: Function
  id: string | number
}
interface keys {
  [s: string]: obj
}
const keys: keys = {}

// 判断类型，是否为input/textarea元素
const ifType = (el: Element): boolean => {
  return el.tagName === ('INPUT' || 'TEXTAREA')
}

export default function pressKey(app: App) {
  app.directive('press-key', {
    mounted(el, bind) {
      // 判断是否为input/textarea，另外由于<el-input>是一个div包裹的input元素，所以需要判断第一个子节点是否为input/textarea
      const inputNode = ifType(el)
        ? el
        : el.children.length && ifType(el.children[0])
        ? el.children[0]
        : undefined

      if (!bind.arg) {
        console.error('请绑定需要触发的按键，例如v-press-key:s')
        return
      }

      if (Object.keys(keys).filter((item) => item === bind.arg).length) {
        console.error('绑定的按键' + bind.arg + '与已有的重名')
        return
      }

      // Object.keys(bind.modifiers)为链式修饰符组成的数组，取数组第一项
      const id = Object.keys(bind.modifiers).length ? Object.keys(bind.modifiers)[0] : ''

      // <input v-press-key.foo:s="xxx" /> :  s-input-foo
      const k =
        inputNode === undefined
          ? bind.arg
          : bind.arg + '-' + inputNode.tagName + (id ? '-' + id : '')

      keys[k] = {
        arg: bind.arg,
        funVal: bind.value,
        id
      }

      if (inputNode !== undefined) {
        inputNode.onkeydown = function keydown(event: KeyboardEvent) {
          // 按键时，从keys中匹配出相同的key
          const match = Object.keys(keys).filter((item) => {
            // 分解出来的数组第一个值即bind.arg
            const key = item.split('-')[0]
            return (
              event.key.toUpperCase() === key ||
              event.key.toLowerCase() === key ||
              event.key === key
            )
          })
          // 如果匹配成功，则执行对应的key上绑定的函数，例如：<input v-press-key:s="fn1" />当在绑定指令的元素上按s键时，匹配成功，执行fn1函数
          match.length &&
            keys[match[0].split('-')[0] + '-' + inputNode.tagName + (id ? '-' + id : '')].funVal()
        }
        return
      }
      window.onkeydown = function keydown(event: KeyboardEvent) {
        const match = Object.keys(keys).filter(
          (item) =>
            event.key.toUpperCase() === item ||
            event.key.toLowerCase() === item ||
            event.key === item
        )

        match.length && keys[match[0]].funVal()
      }
    }
  })
}
