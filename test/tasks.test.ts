import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { parseTasks, readDescriptions } from '../src/index.ts'

describe('readDescriptions', () => {
    it('reads flat descriptions', () => {
        const pkg = { scriptsList: { dev: 'Start dev' } }
        assert.deepEqual(readDescriptions(pkg), { dev: 'Start dev' })
    })
    
    it('reads nested descriptions', () => {
        const pkg = { scriptsList: { descriptions: { dev: 'Start dev' } } }
        assert.deepEqual(readDescriptions(pkg), { dev: 'Start dev' })
    })
    
    it('ignores non-string values and missing config', () => {
        assert.deepEqual(readDescriptions({ scriptsList: { dev: 1 } }), {})
        assert.deepEqual(readDescriptions({}), {})
    })
})

describe('parseTasks', () => {
    const pkg = {
        scripts: { dev: 'vite', tasks: 'npx scripts-list' },
        scriptsList: { dev: 'Start dev' },
    }
    
    it('hides the scripts-list script by default', () => {
        assert.deepEqual(parseTasks(pkg), [{ name: 'dev', command: 'vite', description: 'Start dev' }])
    })
    
    it('includes it with includeSelf', () => {
        assert.equal(parseTasks(pkg, { includeSelf: true }).length, 2)
    })
    
    it('handles a package with no scripts', () => {
        assert.deepEqual(parseTasks({}), [])
    })
})
