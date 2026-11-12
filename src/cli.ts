#!/usr/bin/env node
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'node:util'

import { DEFAULT_FORMAT, FORMAT_NAMES } from './constants/formats.ts'
import { scriptsList } from './index.ts'
import type { FormatName, PackageJson } from './types.ts'

const HELP = `Usage: scripts-list [options]

Options:
  -f, --format <name>   ${FORMAT_NAMES.join(' | ')} (default: ${DEFAULT_FORMAT})
      --[no-]color      Force colors on or off (default: auto)
      --indent <value>  Indent for the list format: a string or a number of spaces
      --include-self    Include scripts that run scripts-list
  -v, --version         Print version
  -h, --help            Print this help
`

const isFormat = (value: string): value is FormatName => (FORMAT_NAMES as readonly string[]).includes(value)

const readJson = async <T>(file: string | URL): Promise<T> => JSON.parse(await readFile(file, 'utf8')) as T

const toIndent = (value = '\t') => /^\d+$/.test(value) ? ' '.repeat(Number.parseInt(value, 10)) : value

const main = async () => {
    const { values } = parseArgs({
        allowNegative: true,
        options: {
            format: { type: 'string', short: 'f', default: DEFAULT_FORMAT },
            color: { type: 'boolean' },
            indent: { type: 'string' },
            'include-self': { type: 'boolean', default: false },
            version: { type: 'boolean', short: 'v' },
            help: { type: 'boolean', short: 'h' },
        },
    })
    
    if (values.help) return process.stdout.write(HELP)
    
    if (values.version) {
        const own = await readJson<{ version: string }>(new URL('../package.json', import.meta.url))
        return process.stdout.write(`${own.version}\n`)
    }
    
    const format = values.format.toLowerCase()
    if (!isFormat(format)) {
        throw new Error(`Invalid format "${format}". Valid formats: ${FORMAT_NAMES.join(', ')}`)
    }
    
    const pkg = await readJson<PackageJson>(join(process.cwd(), 'package.json')).catch(() => {
        throw new Error(`Could not read package.json in ${process.cwd()}`)
    })
    
    const output = scriptsList(pkg, {
        format,
        includeSelf: values['include-self'],
        color: values.color ?? (Boolean(process.stdout.isTTY) && !process.env.NO_COLOR),
        indent: toIndent(values.indent),
        maxWidth: process.stdout.isTTY ? process.stdout.columns : undefined,
    })
    
    process.stdout.write(`${output}\n`)
}

main().catch((error: unknown) => {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`)
    process.exitCode = 1
})
