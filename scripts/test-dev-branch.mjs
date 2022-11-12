import { execSync } from 'child_process'

async function release() {
  execSync(
    `git fetch`
  )
  execSync(
    `git reset --hard`
  )
  execSync(
    `git checkout dev`
  )
  execSync(
    `yarn`
  )
  // TODO: 单元测试
  // execSync(
  //   `npx vue-cli-service test:unit`
  // )
  execSync(
    `yarn build`
  )
}

release()
