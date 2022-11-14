import { logsTable } from './db'

enum LogLevel {
  ERROR = 1,
  WARNING = 2,
  LOG = 3,
  DEBUG = 4
}

const LOG_LEVEL_WRITE_TO_DB = 3

const preProcessLogArguments = (...args: unknown[]) => {
  const result: any[] = [Number(new Date()), 'Default User']
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
        serializedObject = JSON.parse(
          JSON.stringify(
            it
          )
        )
      } catch (err) {
        result.push(
          ...preProcessLogArguments(err)
        )
      }
      result.push(serializedObject)
    }
  })

  return result
}

const gogoendLog = {
  async debug(...args: any) {
    const returnValue = console.log(...args)
    LOG_LEVEL_WRITE_TO_DB <= LogLevel.DEBUG && logsTable.add(preProcessLogArguments(...args))
    return returnValue
  },
  async log(...args: any) {
    const returnValue = console.log(...args)
    LOG_LEVEL_WRITE_TO_DB <= LogLevel.LOG && logsTable.add(preProcessLogArguments(...args))
    return returnValue
  },
  async warn(...args: any) {
    const returnValue = console.warn(...args)
    LOG_LEVEL_WRITE_TO_DB <= LogLevel.WARNING && logsTable.add(preProcessLogArguments(...args))
    return returnValue
  },
  async error(...args: any) {
    const returnValue = console.error(...args)
    LOG_LEVEL_WRITE_TO_DB <= LogLevel.ERROR && logsTable.add(preProcessLogArguments(...args))
    return returnValue
  }
}

export default gogoendLog

