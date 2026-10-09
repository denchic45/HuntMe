import { useDark, useToggle } from '@vueuse/core'

export function useTheme() {
  const isDark = useDark({
    selector: 'html',
    attribute: 'class',
    valueDark: 'dark',
    valueLight: '',
  })

  const toggleDark = useToggle(isDark)

  const setDark = (value: boolean) => {
    isDark.value = value
  }

  return {
    isDark,
    toggleDark,
    setDark,
  }
}
