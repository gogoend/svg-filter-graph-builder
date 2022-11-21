import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const PATH_TO_PACKAGE_JSON = path.resolve('./package.json')
const PATH_TO_RUNTIME_CONFIG_JSON = path.resolve('./public/runtime-config.json')

const getPackageInfo = () => fs.readFileSync(
  PATH_TO_PACKAGE_JSON
)

const getRuntimeConfig = () => fs.readFileSync(
  PATH_TO_RUNTIME_CONFIG_JSON
)

async function build() {
  execSync(
    'yarn version --patch --no-git-tag-version'
  )
  const runtimeConfig = JSON.parse(getRuntimeConfig().toString('utf-8'))
  const packageInfo = JSON.parse(getPackageInfo().toString('utf-8'))

  runtimeConfig.name = packageInfo.name
  runtimeConfig.version = packageInfo.version
  runtimeConfig.buildVersion = typeof runtimeConfig.buildVersion === 'number' ? runtimeConfig.buildVersion + 1 : 1
  runtimeConfig.buildTime = Number(new Date())
  runtimeConfig.buildHash = execSync('git rev-parse HEAD').toString().trim()
  fs.writeFileSync(
    PATH_TO_RUNTIME_CONFIG_JSON,
    JSON.stringify(
      runtimeConfig,
      null,
      '  '
    )
  )
  execSync(
    'yarn'
  )
  execSync(
    'yarn build'
  )
}

build()
