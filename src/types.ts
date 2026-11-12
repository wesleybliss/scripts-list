import type { FORMAT_NAMES } from './constants/formats.ts'

export type FormatName = typeof FORMAT_NAMES[number]

export interface Task {
    name: string
    command: string
    description?: string
}

export interface FormatOptions {
    /** Emit ANSI colors */
    color: boolean
    /** Prefix for lines below each script name (`list` format) */
    indent: string
    /** Terminal width; the `table` format truncates to fit */
    maxWidth?: number
}

export type Formatter = (tasks: Task[], options: FormatOptions) => string

export interface PackageJson {
    scripts?: Record<string, string>
    scriptsList?: Record<string, unknown>
}

export interface ParseOptions {
    /** Include scripts that run scripts-list itself */
    includeSelf?: boolean
}
