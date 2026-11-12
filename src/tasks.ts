import { SELF_COMMAND } from './constants/formats.ts'
import type { PackageJson, ParseOptions, Task } from './types.ts'

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * Descriptions live under `scriptsList` in package.json, either flat
 * (`{ "dev": "..." }`) or nested (`{ "descriptions": { "dev": "..." } }`)
 */
export const readDescriptions = (pkg: PackageJson): Record<string, string> => {
    const config = pkg.scriptsList
    if (!isRecord(config)) return {}
    
    const source = isRecord(config.descriptions) ? config.descriptions : config
    
    return Object.fromEntries(
        Object.entries(source).filter((entry): entry is [string, string] => typeof entry[1] === 'string'),
    )
}

export const parseTasks = (pkg: PackageJson, options: ParseOptions = {}): Task[] => {
    const descriptions = readDescriptions(pkg)
    
    return Object.entries(pkg.scripts ?? {})
        .filter(([, command]) => options.includeSelf || !command.includes(SELF_COMMAND))
        .map(([name, command]) => ({ name, command, description: descriptions[name] }))
}
