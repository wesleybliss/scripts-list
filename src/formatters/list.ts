import { NO_DESCRIPTION, NO_SCRIPTS } from '../constants/formats.ts'
import { paint } from '../lib/style.ts'
import type { Formatter } from '../types.ts'

export const listFormatter: Formatter = (tasks, options) => {
    if (tasks.length === 0) return NO_SCRIPTS
    
    return tasks
        .map(task => {
            const name = paint(['bold', 'green'], task.name, options.color)
            const command = paint('gray', task.command, options.color)
            const description = task.description
                ? task.description
                : paint('dim', NO_DESCRIPTION, options.color)
            
            return `${name}:\n${options.indent}${description}\n${options.indent}${command}`
        })
        .join('\n\n')
}
