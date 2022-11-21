import { logsTable, appTable } from './db'

enum LogLevel {
  ERROR = 1,
  WARNING = 2,
  LOG = 3,
  DEBUG = 4
}

const LOG_LEVEL_WRITE_TO_DB = 3

const preProcessLogArguments = (...args: unknown[]) => {
  const result: any[] = []
  args.forEach(it => {
    if (
      ['string', 'number', 'boolean', 'undefined', 'bigint'].includes(typeof it) || it === null
    ) {
      result.push(it)
    } else if (typeof it === 'symbol') {
      result.push(`Symbol(${it.description})`)
    } else if (typeof it === 'function') {
      result.push(it.toString())
    } else if (it instanceof Error) {
      result.push({
        message: it.message,
        stack: it.stack
      })
    } else {
      let serializedObject: Record<any, any> = {}
      try {
        // TODO: 处理Vue组件时，会出现死循环的情况
        serializedObject = JSON.parse(
          JSON.stringify(
            it
          )
        )
      } catch (err) {
        result.push({
          message: (err as Error).message,
          stack: (err as Error).stack
        })
      }
      result.push(serializedObject)
    }
  })

  return result
}

const gogoendLog = {
  async debug(...args: any) {
    const returnValue = console.log(...args)
    LOG_LEVEL_WRITE_TO_DB >= LogLevel.DEBUG && await logsTable.add(
      preProcessLogArguments(
        LogLevel[LogLevel.DEBUG],
        Number(new Date()),
        (await appTable.get('lastUserProfileId'))?.value,
        ...args
      )
    )
    return returnValue
  },
  async log(...args: any) {
    const returnValue = console.log(...args)
    LOG_LEVEL_WRITE_TO_DB >= LogLevel.LOG && await logsTable.add(
      preProcessLogArguments(
        LogLevel[LogLevel.LOG],
        Number(new Date()),
        (await appTable.get('lastUserProfileId'))?.value,
        ...args
      )
    )
    return returnValue
  },
  async warn(...args: any) {
    const returnValue = console.warn(...args)
    LOG_LEVEL_WRITE_TO_DB >= LogLevel.WARNING && await logsTable.add(
      preProcessLogArguments(
        LogLevel[LogLevel.WARNING],
        Number(new Date()),
        (await appTable.get('lastUserProfileId'))?.value,
        ...args
      )
    )
    return returnValue
  },
  async error(...args: any) {
    const returnValue = console.error(...args)
    LOG_LEVEL_WRITE_TO_DB >= LogLevel.ERROR && await logsTable.add(
      preProcessLogArguments(
        LogLevel[LogLevel.ERROR],
        Number(new Date()),
        (await appTable.get('lastUserProfileId'))?.value,
        ...args
      )
    )
    return returnValue
  }
}

export default gogoendLog

