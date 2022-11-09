import { execSync } from 'child_process'

async function release() {
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
