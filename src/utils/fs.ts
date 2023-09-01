import * as fs from 'fs/promises'

export const access = (path: string) => fs.access(path, fs.constants.F_OK)
export const slurp = (path: string) => fs.readFile(path, { encoding: 'utf8' })
