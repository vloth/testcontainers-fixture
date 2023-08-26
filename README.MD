<!-- markdownlint-configure-file {
  "MD013": {
    "code_blocks": false,
    "tables": false
  },
  "MD033": false,
  "MD041": false
} -->

<div align="center">

# testcontainers fixture

testcontainers-fixture is a **script** made to run tests with container dependencies easier.

[Getting started](#getting-started) •
[Configuration](#configuration)

</div>

## Getting started

```sh
# Run test:integration npm script command
$ npx testcontainers-fixture npm run test:integration

# Run test:e2e npm script command in watch mode
$ npx testcontainers-fixture npm run e2e -- --watch
```

## Configuration

Configuration is done through a `.testcontainers-fixture`
file in the root folder of your project. 

```yaml
---
  container: redis
  expose-ports: [6379]
  env:
    REDIS_PORT: CONTAINER_PORT:6379
    REDIS_HOST: CONTAINER_HOST
  wait:
    - listening-ports
```

More examples can be found at [samples](./samples) folder.
