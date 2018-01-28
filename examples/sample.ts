import { $fs, $db } from '../src/hackmud-types/hack-types';

function main(context, args) {
    const l = $fs.scripts.lib();
    const r = $db.i({"SID":"haxor"});
    l.log('testing');
    return l.get_log();
}