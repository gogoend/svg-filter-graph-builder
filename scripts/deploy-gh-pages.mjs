import { execSync } from 'child_process'

async function release() {
  execSync(
    'git fetch'
  )
  execSync(
    'git reset --hard'
  )
  execSync(
    'git checkout build/gh-page-src'
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
