import { NO_DESCRIPTION, NO_SCRIPTS } from '../constants/formats.ts'
import { paint } from '../lib/style.ts'
import type { Formatter } from '../types.ts'

const HEADERS = ['Script', 'Description', 'Command'] as const
const MIN_WIDTH = 12
// 4 vertical borders + 1 space of padding on each side of 3 columns
const CHROME_WIDTH = 10

const truncate = (text: string, width: number) => {
    return text.length <= width ? text : `${text.slice(0, width - 1)}…`
}

const fitWidths = (widths: number[], maxWidth?: number) => {
    if (!maxWidth) return widths
    
    const fitted = [...widths]
    let overflow = fitted.reduce((sum, it) => sum + it, CHROME_WIDTH) - maxWidth
    
    // Shrink Command first, then Description; Script names stay intact
    for (const index of [2, 1]) {
        if (overflow <= 0) break
        const shrink = Math.min(overflow, Math.max(0, (fitted[index] ?? 0) - MIN_WIDTH))
        fitted[index] = (fitted[index] ?? 0) - shrink
        overflow -= shrink
    }
    
    return fitted
}

export const tableFormatter: Formatter = (tasks, options) => {
    if (tasks.length === 0) return NO_SCRIPTS
    
    const rows = tasks.map(it => [it.name, it.description ?? NO_DESCRIPTION, it.command])
    const naturalWidths = HEADERS.map((header, col) => {
        return Math.max(header.length, ...rows.map(row => row[col]?.length ?? 0))
    })
    const widths = fitWidths(naturalWidths, options.maxWidth)
    
    const line = (left: string, join: string, right: string) => {
        return left + widths.map(it => '─'.repeat(it + 2)).join(join) + right
    }
    
    const cell = (text: string, col: number) => truncate(text, widths[col] ?? 0).padEnd(widths[col] ?? 0)
    const row = (cells: string[]) => `│ ${cells.join(' │ ')} │`
    
    const header = row(HEADERS.map((it, col) => paint('bold', cell(it, col), options.color)))
    
    const body = rows.map(([name = '', description = '', command = ''], index) => {
        const hasDescription = Boolean(tasks[index]?.description)
        
        return row([
            paint('green', cell(name, 0), options.color),
            hasDescription ? cell(description, 1) : paint('dim', cell(description, 1), options.color),
            paint('gray', cell(command, 2), options.color),
        ])
    })
    
    return [
        line('┌', '┬', '┐'),
        header,
        line('├', '┼', '┤'),
        ...body,
        line('└', '┴', '┘'),
    ].join('\n')
}
