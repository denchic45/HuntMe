import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

/**
 * Фирменный пресет PrimeVue темы HuntMe на основе брендбука ФСП (Федерация спортивного программирования).
 *
 * Фирменные цвета ФСП:
 * - Primary Blue: #402FFF (акцентные действия, кнопки, фокусы)
 * - Accent Red:   #EC1D35 (достижения ФСП, алерты, бейджи)
 * - Dark Neutral: #1B1C21 / #24262c / #2c2e36 (поверхности, карточки темной темы)
 * - Light Neutral: #EDEDED / #FFFFFF (светлые поверхности)
 * - Secondary:    #C8C9CA (границы, разделители)
 */
export const FspPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
    },
    // Фирменный синий ФСП (#402FFF)
    blue: {
      50: '#eef0ff',
      100: '#dce0ff',
      200: '#bac2ff',
      300: '#97a3ff',
      400: '#6a77ff',
      500: '#402FFF',
      600: '#3222e0',
      700: '#2618b8',
      800: '#1d1290',
      900: '#170e73',
      950: '#0c0645',
    },
    // Фирменный красный ФСП (#EC1D35)
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#EC1D35',
      600: '#d4142a',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    // Фирменный нейтральный темный (#1B1C21), переопределяющий темные поверхности PrimeVue (zinc)
    zinc: {
      50: '#f6f6f7',
      100: '#e7e8eb',
      200: '#cfd1d7',
      300: '#aeb1bc',
      400: '#858998',
      500: '#65697a',
      600: '#4e5261',
      700: '#3d404d',
      800: '#2c2e36',
      900: '#24262c',
      950: '#1B1C21',
    },
  },
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
  },
})

export default FspPreset
