function (context, args) {
    const l = #fs.scripts.lib()
    l.log('test')
    return l.get_log()
    function internal() {}
}