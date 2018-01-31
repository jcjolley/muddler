//Out of Context error.
const OocError = Error('You don\'t execute this code here silly. :)');
class accts {
    balance() { throw OocError; }
    transactions(args) { throw OocError; }
    xfer_gc_to(args) { throw OocError; }
}
let scriptorTarget = {};
function generateSecondHandler(args) {
    if (args) {
        return {
            get(target, propKey) {
                if (args.indexOf(propKey) === -1) {
                    throw Error("Not a function.");
                }
                else {
                    return (args) => { };
                }
            }
        };
    }
    else {
        return {
            get(target, propKey) {
                return (args) => { };
            }
        };
    }
}
let scriptorHandler = {
    get(target, propKey) {
        switch (propKey) {
            case 'accts':
                return new Proxy(target, generateSecondHandler(['balance', 'transactions', 'xfer_gc_to', 'xfer_gc_to_caller']));
            case 'autos':
                return new Proxy(target, generateSecondHandler(['balance']));
            case 'chats':
                return new Proxy(target, generateSecondHandler(['channels', 'create', 'join', 'leave', 'send', 'tell', 'users']));
            case 'corps':
                return new Proxy(target, generateSecondHandler(['create', 'hire', 'manage', 'offers', 'quit', 'top']));
            case 'escrow':
                return new Proxy(target, generateSecondHandler(['charge', 'confirm', 'stats']));
            case 'kernel':
                return new Proxy(target, generateSecondHandler(['hardline']));
            case 'market':
                return new Proxy(target, generateSecondHandler(['browse', 'buy', 'sell', 'stats']));
            case 'scripts':
                return new Proxy(target, generateSecondHandler(['ensure_highsec', 'ensure_lowsec', 'ensure_midsec', 'ensure_nullsec', 'fullsec', 'get_access_level', 'get_level', 'highsec', 'midsec', 'nullsec', 'sys', 'trust', 'user']));
            case 'sys':
                return new Proxy(target, generateSecondHandler(['access_log', 'breach', 'cull', 'init', 'loc', 'manage', 'specs', 'status', 'upgrade_log', 'upgrades', 'xfer_upgrade_to']));
            case 'users':
                return new Proxy(target, generateSecondHandler(['active', 'last_action', 'top']));
            default:
                return new Proxy(target, generateSecondHandler());
        }
    }
};
const Scriptor = new Proxy(scriptorTarget, scriptorHandler);
/**
 * NULLSEC
 */
export const $s = Scriptor;
/**
 * FULLSEC
 */
export const $fs = Scriptor;
/**
 * HIGHSEC
 */
export const $ms = Scriptor;
/**
 * LOWSEC
 */
export const $ls = Scriptor;
/**
 * NULLSEC
 */
export const $ns = Scriptor;
/**
 * FULLSEC
 */
export const $4s = Scriptor;
/**
 * HIGHSEC
 */
export const $3s = Scriptor;
/**
 * LOWSEC
 */
export const $2s = Scriptor;
/**
 * NULLSEC
 */
export const $1s = Scriptor;
export class $db {
    /**
     * Inserts a new document or documents.
     * @param obj An object or array of objects to pass.
     */
    static i(obj) { }
    /**
     * Removes any documents matching the query
     */
    static r(query) { }
    /**
     * Returns any documents matching the query.
     */
    static f(query, projection) { throw OocError; }
    ;
    /**
     * Updates any pre-existing documents matching the query.
     */
    static u(query, update) { }
}
