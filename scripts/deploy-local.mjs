import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const getPackageInfo = () => fs.readFileSync(
  path.resolve('./package.json')
)

const rawPackageInfoFileContent = getPackageInfo().toString()

async function release() {
  execSync(
    'yarn version --patch --no-git-tag-version'
  )
  execSync(
    'yarn'
  )
  let newVersion = ''
  try {
    execSync(
      'yarn build'
    )
    newVersion = JSON.parse(
      getPackageInfo().toString()
    ).version
    execSync(
      `git add -A`
    )
    execSync(
      `git commit -m v${newVersion}`
    )
    execSync(
      `git tag v${newVersion}`
    )
  } catch (err) {
    console.error(err)
    fs.writeFileSync(
      path.resolve('./package.json'),
      rawPackageInfoFileContent
    )
  }
}

release()
