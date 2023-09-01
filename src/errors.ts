import { t, reporter } from '@/common'
import * as util from 'util'

export const codes = {
  ['config.miss']: 'Configuration file not found',
  ['config.read']: 'Error reading configuration file %s',
  ['config.parse']: 'Configuration parsing error:\n%s',
  ['config.format']: 'Configuration format error:\n%s',
  ['image.container.run']: 'Error running container from image %s:\n%s'
}

export const format = (code: keyof typeof codes, ...values: any[]) =>
  util.format(codes[code], ...values) as string

export const toError = (code: keyof typeof codes) => (error: unknown) =>
  format(code, error instanceof Error ? error.message : String(error))

export const toDecodeError = (code: keyof typeof codes) => (error: unknown) =>
  format(code, reporter.formatValidationErrors(error as t.Errors).join('\n'))
