import type { App } from 'vue'
import permission from './directives/permission'

export default function directives(app: App) {
  permission(app)
}
