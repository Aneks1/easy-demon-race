import { setTheme } from './config'
import Box from './components/Box.vue'
export { Box }
import type { IvyConfig } from './config'
export * from './config'
import './styles/utilities.css'
import './styles/colors.css'

export default {
  install(app: any, options?: IvyConfig) {
    if (options) setTheme(options)
    app.component('Box', Box)
  },
}
