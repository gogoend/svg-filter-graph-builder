import { execSync } from 'child_process'

async function release() {
  console.log(process.env)
  execSync(
    `git fetch`
  )
  execSync(
    `git reset --hard`
  )
  execSync(
    // todo
    `git checkout $GITHUB_REF`
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
