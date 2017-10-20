function(context, args) {
    let h = #s.scripts.lib()
    h.log('Blargh')
    h.is_valid_name('Blarg2')
    h.abcdefghi('test')
    return { "msg": h.get_log()}
}