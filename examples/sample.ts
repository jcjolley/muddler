function (context, args) {
    const l = #fs.scripts.lib()
    l.log('testing')
    return l.get_log()
}