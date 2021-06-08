import { Path, Port } from '@/views/AppMain/components/SvgCanvas/type'

function checkLoop(path: Path) {
  const { to, from } = path
  let hasLoop = false
  const innerLoop = (from: Port<any>) => {
    if (to.vm === from.vm) {
      hasLoop = true
      return
    }
    for (let i = 0; i < from.vm.props.relativePaths.in.length; i++) {
      if (hasLoop) break
      const item = from.vm.props.relativePaths.in[i]
      innerLoop(item.from)
    }
  }
  innerLoop(from)
  return hasLoop
}

function checkDuplicateLink(path: Path) {
  const { to, from } = path

  const duplicatedLinks = to.vm.props.relativePaths.in.filter((path: Path) => {
    return (
      from.attr === path.from.attr && from.vm === path.from.vm &&
      to.attr === path.to.attr && to.vm === path.to.vm
    )
  })

  return duplicatedLinks.length > 0
}

export function portCanBeConnected(path: Path) {
  // 在当前port元素上点击后即松开
  if (path.from.vm === path.to.vm) {
    return false
  }
  // 尝试连接类型（in、out）相同的元素
  if (path.from.el?.dataset.portType === path.to.el?.dataset.portType) {
    return false
  }
  // 发生了重复连接
  if (checkDuplicateLink(path)) {
    return false
  }
  // 连接产生了环
  if (checkLoop(path)) {
    return false
  }
  console.log(
    path.to.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in
  )

  return true
}
