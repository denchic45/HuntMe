import pluginVue from 'eslint-plugin-vue'
import { vueTsConfigs, withVueTs } from '@vue/eslint-config-typescript'

export default withVueTs(pluginVue.configs['flat/essential'], vueTsConfigs.recommended, {
  ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'docs/**'],
})
