import type { App } from 'vue'
import permission from './directives/permission'
import pressKey from './directives/press-key'

export default function directives(app: App) {
  permission(app)
  pressKey(app)
}
