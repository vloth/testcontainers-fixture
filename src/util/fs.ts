import * as fs from 'fs/promises'
import { TE, E } from '@/common'

export const access = (path: string) =>
  TE.tryCatch(() => fs.access(path, fs.constants.F_OK), E.toError)

export const slurp = (path: string) =>
  TE.tryCatch(() => fs.readFile(path, { encoding: 'utf8' }), E.toError)
