import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { scriptsList } from '../src/index.ts'

const ESC = '\u001b['

const pkg = {
    scripts: { dev: 'vite --host', build: 'tsc && vite build' },
    scriptsList: { dev: 'Start dev server' },
}

describe('table', () => {
    it('is the default format', () => {
        assert.equal(scriptsList(pkg), scriptsList(pkg, { format: 'table' }))
    })
    
    it('renders aligned rows', () => {
        const lines = scriptsList(pkg).split('\n')
        assert.equal(new Set(lines.map(it => it.length)).size, 1)
        assert.match(lines[1] ?? '', /Script.*Description.*Command/)
        assert.match(scriptsList(pkg), /\(No description\)/)
    })
    
    it('truncates to maxWidth', () => {
        const lines = scriptsList(pkg, { maxWidth: 40 }).split('\n')
        assert.ok(lines.every(it => it.length <= 40))
        assert.match(scriptsList(pkg, { maxWidth: 40 }), /…/)
    })
})

describe('list', () => {
    it('renders name, description, command', () => {
        const out = scriptsList(pkg, { format: 'list', indent: '  ' })
        assert.match(out, /^dev:\n {2}Start dev server\n {2}vite --host/)
    })
})

describe('json', () => {
    it('renders null for missing descriptions', () => {
        const out = JSON.parse(scriptsList(pkg, { format: 'json' }))
        assert.deepEqual(out.build, { command: 'tsc && vite build', description: null })
    })
})

describe('colors', () => {
    it('only emits ANSI when enabled', () => {
        assert.ok(!scriptsList(pkg).includes(ESC))
        assert.ok(scriptsList(pkg, { color: true }).includes(ESC))
    })
})
