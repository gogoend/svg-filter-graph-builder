import { execSync } from 'child_process'

async function release() {
  if (!process.env.GITHUB_ACTIONS) {
    console.error('[CI Stage] 未使用 GitHub Action 执行本脚本，即将退出')
    process.exit(1)
    return
  }
  execSync(
    'git fetch'
  )
  execSync(
    'git reset --hard'
  )
  execSync(
    'git checkout build/gh-pages-src'
  )
  execSync(
    'yarn version --patch --no-git-tag-version'
  )
  execSync(
    'yarn'
  )
  execSync(
    'yarn build'
  )
}

release()
