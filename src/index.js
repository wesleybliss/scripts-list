#!/bin/env node

const path = require('path')
const yargs = require('yargs/yargs')
const json = require(path.resolve(process.cwd(), 'package.json'))
const utils = require('./utils')

const args = yargs(process.argv.slice(2)).argv
const scripts = json ? json.scripts : []
const descs = (json && json.scriptsList) ? json.scriptsList.descriptions : []
const formatters = utils.requireAllFormatters()

if (!scripts) {
    
    console.info('No tasks found')
    
} else {
    
    const tasks = utils.parseTasks(scripts, descs, args)
    const format = args.format || 'json'
    const formatterIsValid = Object.keys(formatters).includes(format)
    
    if (!formatterIsValid) {
        console.warn(`Invalid format "${format}" given; defaulting to json`)
        console.warn('Valid formats are', Object.keys(formatters).join(', '))
    }
    
    const formatter = formatters[format] || formatters['json']
    const result = formatter(tasks, args)
    
    console.log(result)
    
}
