import * as fs from 'fs/promises'
import { TE, E } from '../fp'

export const exists = (path: string) =>
  TE.tryCatch(
    () => fs.access(path, fs.constants.F_OK).then(() => true),
    E.toError
  )

export const slurp = (path: string) =>
  TE.tryCatch(() => fs.readFile(path, { encoding: 'utf8' }), E.toError)
