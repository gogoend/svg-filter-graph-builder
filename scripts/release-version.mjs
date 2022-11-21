import { execSync } from 'child_process'
import { runBuild } from './_public.mjs'
import { getPackageInfo } from './_public.mjs'

async function release() {
  await runBuild()
  execSync(
    `git add -A`
  )
  const packageInfo = JSON.parse(getPackageInfo().toString('utf-8'))
  const tagName = `v${packageInfo.version}`
  execSync(
    `git commit -m ${tagName}`
  )
  execSync(
    `git tag ${tagName}`
  )
  execSync(
    `git push origin ${tagName}`
  )
}

release()
