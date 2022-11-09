import { execSync } from 'child_process'

async function release() {
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
