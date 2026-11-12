import { DEFAULT_FORMAT } from './constants/formats.ts'
import { formatters } from './formatters/index.ts'
import { parseTasks } from './tasks.ts'
import type { FormatName, FormatOptions, PackageJson, ParseOptions } from './types.ts'

export interface ScriptsListOptions extends ParseOptions, Partial<FormatOptions> {
    format?: FormatName
}

/** Render the scripts of a parsed package.json as a string */
export const scriptsList = (pkg: PackageJson, options: ScriptsListOptions = {}): string => {
    const { format = DEFAULT_FORMAT, includeSelf, color = false, indent = '\t', maxWidth } = options
    const tasks = parseTasks(pkg, { includeSelf })
    
    return formatters[format](tasks, { color, indent, maxWidth })
}

export { DEFAULT_FORMAT, FORMAT_NAMES } from './constants/formats.ts'
export { formatters } from './formatters/index.ts'
export { parseTasks, readDescriptions } from './tasks.ts'
export type * from './types.ts'
