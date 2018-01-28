import { $fs, $db, ScriptReturn } from './hack-types';

function _(context, args):ScriptReturn {
	const l = $fs.scripts.lib();
    const r = $db.i({"SID":"haxor"});
    l.log('testing');
    return l.get_log();
}