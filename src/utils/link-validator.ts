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
    // out port可以连出多条线，但in port只能连入一条线
    return (
      to.attr === path.to.attr && to.vm === path.to.vm
    )
  })

  return duplicatedLinks.length > 0
}

export function assertPortCanBeConnected(path: Path) {
  // 在当前port元素上点击后即松开
  if (path.from.vm === path.to.vm) {
    throw new TypeError('连接了自身')
  }
  // 尝试连接类型（in、out）相同的端口
  if (path.from.el?.dataset.portType === path.to.el?.dataset.portType) {
    throw new TypeError('端口不兼容')
  }
  // 发生了重复连接
  if (checkDuplicateLink(path)) {
    throw new TypeError('发生了重复连接')
  }
  // 连接产生了环
  if (checkLoop(path)) {
    throw new TypeError('连接产生了环')
  }
  console.log(
    path.to.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in[0]
      ?.from.vm.props.relativePaths.in
  )
}
