import type { MouseEventHelper } from './type'

const mouseEventHelper = function(ev: MouseEvent, handlers?: MouseEventHelper.Handlers): void {
  const start = handlers?.start || (() => void 0)
  // const moveInner = handlers.moveInner || (() => void 0)
  // const moveOuter = handlers.moveOuter || (() => void 0)
  const move = handlers?.move || (() => void 0)
  const up = handlers?.up || (() => void 0)

  const originEl = ev.target as HTMLElement

  start(ev, { originEl })
  const handleTargetTouchEvent = (ev: MouseEvent) => {
    switch (ev.type) {
      case 'mousemove': {
        // const touch = ev // .changedTouches[0]
        // const touchingEl = document.elementFromPoint(touch.pageX, touch.pageY - document.documentElement.scrollTop)
        // if (touchingEl === startEl) {
        //   moveInner.call(_this, ev)
        // } else {
        //   moveOuter.call(_this, ev)
        // }
        move(ev, {
          originEl
        })
        break
      }
      case 'mouseup': {
        document.removeEventListener('mousemove', handleTargetTouchEvent)
        document.removeEventListener('mouseup', handleTargetTouchEvent)
        up(ev, {
          originEl
        })
        break
      }
    }
  }
  document.addEventListener('mousemove', handleTargetTouchEvent)
  document.addEventListener('mouseup', handleTargetTouchEvent)
}

export default mouseEventHelper
