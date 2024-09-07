const colors = {
    ok: '32',
    info: '37',
    warn: '33',
    error: '31',
    fatal: '35',
    ans: '36',
    reset: '0'
}

const format = {
    default: '0',
    bold: '1',
    italic: '3'
}

const now = new Date()
const formatted = 
    `${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()}.` +
    `${now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1}.` +
    `${now.getFullYear()} ` +
    `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()}:` +
    `${now.getMinutes < 10 ? '0' + now.getMinutes() : now.getMinutes()}:` +
    `${now.getSeconds < 10 ? '0' + now.getSeconds() : now.getSeconds()}`

const gcc = (type, fm = 'default') => `\x1b[${format[fm]};${colors[type]}m`

const message = (type, where, message) => 
    console.log(gcc(type) +
    `[${formatted}] ${gcc(type, 'bold')}OK${gcc(type)} | ${where} => ${gcc(type, 'italic')}${message}` +
    gcc('reset'))

module.exports = {
    ok: (where, msg) => message('ok', where, msg),
    fatal: (where, msg) => message('fatal', where, msg),
    warn: (where, msg) => message('warn', where, msg),
    ans: (where, msg) => message('ans', where, msg),
    error: (where, msg) => message('error', where, msg),
    info: (where, msg) => message('info', where, msg)
}