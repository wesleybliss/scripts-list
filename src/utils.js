const fs = require('fs')
const path = require('path')

const hasOwnProperty = (obj, prop) =>
    Object.prototype.hasOwnProperty.call(obj, prop)

const requireAll = dir => fs
    .readdirSync(dir, 'utf8')
    .reduce((acc, it) => {
        const file = path.resolve(dir, it)
        if (!fs.statSync(file).isFile) return acc
        return [...acc, require(file)]
    }, [])

const requireAllFormatters = () => {
    const dir = path.resolve(__dirname, 'formatters')
    const list = requireAll(dir)
    return list.reduce((acc, it) => ({
        ...acc,
        [it.key]: it.fn,
    }), {})
}

const parseTasks = (scripts, descs, args = {}) =>
    Object.keys(scripts).reduce((acc, name) => {
        const command = scripts[name]
        const hasDesc = (descs && hasOwnProperty(descs, name))
        const description = hasDesc ? descs[name] : '(No description)'
        if (!args.includeSelf && (name === 'tasks' || command.includes('yarn-tasks')))
            return acc
        return {
            ...acc,
            [name]: {
                command,
                description,
            }
        }
    }, {})

module.exports.requireAll = requireAll
module.exports.requireAllFormatters = requireAllFormatters
module.exports.parseTasks = parseTasks
