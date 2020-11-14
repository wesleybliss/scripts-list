const c = require('ansi-colors')

const fn = (tasks, args) => {
    
    c.enabled = args.color || false
    
    const out = Object.keys(tasks).map(it => {
        
        const task = tasks[it]
        const name = c.bold.green(it)
        const command = c.gray(task.command)
        const description = c.white(task.description)
        
        const indent = (args.indent === undefined || args.indent === true)
            ? '\t' : args.indent
        
        return `${name}:\n${indent}${description}\n${indent}${command}`
        
    })
    
    console.info(out.join('\n\n'))
    
}

module.exports = {
    key: 'list',
    fn,
}
