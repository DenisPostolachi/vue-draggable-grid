import { IntersectionObserverConfig } from '../types/components'
import testsPayload from './payload'
import { Breakpoints, Layout } from '../types/helpers'

const { keysValidatorPayload, layoutValidatorPayload } = testsPayload

export const breakpointsValidator = (cols: Breakpoints): boolean => {
  const propColsKeys = (Object.keys(cols) as (keyof typeof cols)[])
  const colsValues = propColsKeys.map(k => typeof cols[k] === 'number')

  return keysValidator(keysValidatorPayload.validKeys, propColsKeys) && colsValues.indexOf(false) === -1
}

export const intersectionObserverConfigValidator = (config: IntersectionObserverConfig) => {
  config = { ...testsPayload.intersectionObserverConfig, ...config }
  const keys: (keyof IntersectionObserverConfig)[] = ['root', 'rootMargin', 'threshold']
  const configKeys = (Object.keys(config) as (keyof IntersectionObserverConfig)[])

  return !configKeys.map(k => keys.includes(k)).includes(false)
}

export const keysValidator = (requiredKeys: string[], propsKeys: string[]): boolean => {
  const coincidenceKeys = propsKeys.filter(k => requiredKeys.indexOf(k) >= 0)

  return propsKeys.length >= requiredKeys.length && coincidenceKeys.length === requiredKeys.length
}

export const layoutValidator = (layout: Layout): boolean => {
  const { validOptionalLayout, validRequiredLayout } = layoutValidatorPayload
  const validLayout = { ...validRequiredLayout, ...validOptionalLayout }
  const requiredKeys = Object.keys(validRequiredLayout)

  const requiredKeysValid = layout.every(item => keysValidator(requiredKeys, Object.keys(item)))

  if (!requiredKeysValid) {
    return false
  }

  return layout.every(item => {
    const layoutItemKeys = Object.keys(item) as (keyof typeof item)[]

    return layoutItemKeys.every(key => {
      if (key === 'i') {
        return validLayout[key] ? typeof item[key] === typeof validLayout[key] || typeof item[key] === 'string' : true
      }
      return validLayout[key] ? typeof item[key] === typeof validLayout[key] : true
    })
  })
}

export const marginValidator = (value: [number, number]): boolean => {
  const values = value.map(v => typeof v === 'number')
  const isLength = value.length === 2

  return values.indexOf(false) === -1 && isLength
}
