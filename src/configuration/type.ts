import { t } from '@/common'

const WaitForListening = t.readonly(
  t.exact(
    t.type({
      ['listening-ports']: t.literal(true)
    })
  )
)

const WaitForTimeout = t.readonly(
  t.exact(
    t.type({
      ['timeout']: t.number
    })
  )
)

export const ImageConfiguration = t.readonly(
  t.exact(
    t.type({
      ['image']: t.string,
      ['expose-ports']: t.array(t.number),
      ['env']: t.record(t.string, t.string),
      ['wait']: t.union([t.undefined, WaitForListening, WaitForTimeout])
    })
  )
)
export type ImageConfiguration = t.TypeOf<typeof ImageConfiguration>

export const DockerComposeConfiguration = t.readonly(
  t.exact(
    t.type({
      ['docker-compose-file']: t.string,
      ['env']: t.record(t.string, t.string)
    })
  )
)
export type DockerComposeConfiguration = t.TypeOf<
  typeof DockerComposeConfiguration
>

export const Configuration = t.union([
  ImageConfiguration,
  DockerComposeConfiguration
])
export type Configuration = t.TypeOf<typeof Configuration>

export const isImage = (configuration: Configuration) =>
  'image' in configuration
