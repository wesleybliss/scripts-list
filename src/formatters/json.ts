import type { Formatter } from '../types.ts'

export const jsonFormatter: Formatter = tasks => {
    const result = Object.fromEntries(
        tasks.map(it => [it.name, { command: it.command, description: it.description ?? null }]),
    )
    
    return JSON.stringify(result, null, 4)
}
