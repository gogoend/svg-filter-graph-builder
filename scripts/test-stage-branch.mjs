import { execSync } from 'child_process'

async function release() {
  if (!process.env.GITHUB_ACTIONS) {
    console.error('[CI Stage] 未使用 GitHub Actions 执行本脚本，即将退出')
    process.exit(1)
    return
  }
  console.log(`[CI Stage] 准备测试 ${process.env.GITHUB_HEAD_REF} 分支`)
  execSync(
    `git fetch`
  )
  execSync(
    `git reset --hard`
  )
  execSync(
    `git checkout $GITHUB_HEAD_REF`
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
  console.log(`[CI Stage] ${process.env.GITHUB_HEAD_REF} 分支测试结束`)
}

release()
