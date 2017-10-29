function (context, args) {
    const l = #fs.scripts.lib();
    const r = #db.i({"SID":"haxor"});
    l.log('testing')
    return l.get_log()
}