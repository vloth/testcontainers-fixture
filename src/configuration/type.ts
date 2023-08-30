import { t } from '../fp'

const WaitForListening = t.readonly(
  t.type({
    ['listening-ports']: t.literal('true')
  })
)

const WaitForTimeout = t.readonly(
  t.type({
    ['timeout']: t.number
  })
)

export const ImageConfiguration = t.readonly(
  t.type({
    ['image']: t.string,
    ['expose-ports']: t.array(t.number),
    ['env']: t.record(t.string, t.string),
    ['wait']: t.union([t.undefined, WaitForListening, WaitForTimeout])
  })
)

export const DockerComposeConfiguration = t.readonly(
  t.type({
    ['docker-compose-file']: t.string,
    ['env']: t.record(t.string, t.string)
  })
)

export const Configuration = t.union([
  ImageConfiguration,
  DockerComposeConfiguration
])

export type Configuration = t.TypeOf<typeof Configuration>
export type ImageConfiguration = t.TypeOf<typeof ImageConfiguration>
export type DockerComposeConfiguration = t.TypeOf<
  typeof DockerComposeConfiguration
>
