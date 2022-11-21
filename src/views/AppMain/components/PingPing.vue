<template>
  <div
    class="ping-ping"
    v-show="false"
  />
</template>
<script lang="ts" setup>
import log from '@/plugins/log'
import { logsTable } from '../../../plugins/db/init-product-db'
import { onUnmounted } from 'vue'

const POLLING_INTERVAL = 10 * 1000

const logDestination = window.__sfgb_runtime_config__.logDestination

let stopPingFlag = false
onUnmounted(() => {
  stopPingFlag = true
})

const setupPingTimer = () => {
  log.debug('[日志] 开始收集')
  setTimeout(async() => {
    log.debug('[日志] 结束收集并准备发送')
    // 每次发100条
    let logs = await logsTable.limit(100).toArray()
    // 记下本次要发的条目的id，之后发完就可以全删除了
    const logIds = logs.map(it => it.id)

    if (!logs.length) {
      log.debug('[日志] 没有可以发送的日志')
      !stopPingFlag && setupPingTimer()
      return
    }

    logs = logs.map((it) => JSON.stringify(it))
    const formData = new FormData()
    formData.append(
      'file',
      new Blob(
        [logs.join('\n')]
      )
    )

    try {
      const res = await (await fetch(
        logDestination,
        {
          body: formData,
          method: 'post'
        }
      )).json()
      if (res.code === 0) {
        // 清理一下本地数据库中已经发出去的条目
        logsTable.bulkDelete(logIds)
      }
    } catch (err) {
      log.error(err)
    }
    !stopPingFlag && setupPingTimer()
  }, POLLING_INTERVAL)
}

if (logDestination) {
  setupPingTimer()
}
</script>
