import type { FormatName, Formatter } from '../types.ts'
import { jsonFormatter } from './json.ts'
import { listFormatter } from './list.ts'
import { tableFormatter } from './table.ts'

export const formatters: Record<FormatName, Formatter> = {
    table: tableFormatter,
    list: listFormatter,
    json: jsonFormatter,
}
