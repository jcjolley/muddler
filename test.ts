function(context, args) {
    let h = #fs.scripts.lib()
    h.log('Blargh')
    return { msg: h.get_log()}
}