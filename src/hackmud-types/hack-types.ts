import { isObject, isNumber, isArray, isFunction } from "util";

export interface ScriptContext {
	caller:string;
	this_script:string;
	calling_script:string;
	is_scriptor:boolean;
	cols?:number;
}


export interface ScriptReturn {
	ok:boolean;
	msg?:string;
}

//Out of Context error.
const OocError = Error('You don\'t execute this code here silly. :)');

let scriptorTarget = {
};

function generateSecondHandler(args?:string[]){
	if(args) {
		return {
			get(target:any, propKey:string) {
				if(args.indexOf(propKey) === -1) {
					throw Error("Not a function.");
				}
				else {
					return (args?:object)=>{};
				}
			}
		}
	}
	else {
		return {
			get(target:any, propKey:string){
				return (args?:object)=>{};
			}		
		}
	}
}

let scriptorHandler = {
	get(target:object, propKey:string) {
		return new Proxy(target, generateSecondHandler());
	}
}


const Scrpr = new Proxy(scriptorTarget, scriptorHandler);

export interface Scriptor {
	call(obj?:object):string;
}


function shuffle(array: any[]): any[] {
	var currentIndex: number = array.length, temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

let log:string[] = [];

interface lockSimInterface {
	locks?:string|string[]
}
/**
 * Decreped NULLSEC
 * @deprecated
 */
export const $s  = Scrpr;

interface MarketBrowseArgs {
	i?:string|string[]
	tier?:1|2|3|4,
	listed_before?:number,
	listed_after?:number,
	rarity?:0|1|2|3|4|5,
	cost?:number|string,
	name?:string,
	type?:'lock'|'script_space'|'script',
	class?:'architect'|'executive'|'infiltrator'|'scavenger',

	//TODO: get all chars objects mapped
	chars?:object
}
/**
 * Typed FULLSEC
 */

interface ScriptLib {
	corruption_chars:string;
	colors:string;
	corruptions: number[];
	security_level_names: string[];
	math: {};
	json: {};
}
export const $fs = {
	/**
	 * This is a collection of usefull scripts to use in yours!
	 */
	scripts: {
		lib():ScriptLib{throw OocError}
	},

	dtr: {
		/**
		 * A simulation of teir 1 locks.
		 */
		t1_lock_sim:(args?:lockSimInterface)=>{}
	},

	accts: {
		/**
		 * Transfers GC from user to caller.
		 * @param args.ammount The ammount being transfered
		 * @param args.memo The memo to be sent. Between 1-50 chars. Optional.
		 */
		xfer_gc_to_caller(args:{ammount:string|number, memo?:string}){
			throw OocError;
		}
	},

	chats: {
		/**
		 * Creates a channel
		 * @param args.name The name of the channel
		 */
		create(args:{name:string}){throw OocError;},

		/**
		 * Sends a message to a channel.
		 * @param args.channel
		 * @param args.msg
		 */
		send(args:{channel:string, msg:string}){throw OocError;},

		/**
		 * Sends a message to somebody.
		 * @param args.to The reciever
		 * @param args.msg
		 */
		tell(args:{to:string, msg:string}){throw OocError;}
	},

	corps: {
		/**
		 * Creates a new organization
		 * @param args.name The name of the organization
		 */
		create(args:{name:string}){throw OocError;},
		//TODO: Make types for the rest of the coorp commands
		hire(args:object){throw OocError;},
		manage(args:object){throw OocError;},
		offers(args:object){throw OocError;},
		quit(args:object){throw OocError;},
		top(args:object){throw OocError;}
	},

	kernel: {
		/**
		 * Activates hardline mode.
		 * @param args.dc Disconnect from the hardline. Optional
		 */
		hardline(args?:{dc:boolean}){throw OocError;}
	},

	market: {
		/**
		 * Browses the market
		 */
		browse(args:MarketBrowseArgs){throw OocError;}
	}
};

interface TransactionArgs {
	count?:'all'|number,
	to?:string,
	from?:string,
	script?:string
}
/**
 * Typed HIGHSEC
 */
export const $hs = {
	accts: {
		/**
		 * Returns the balance of the user.
		 * @returns A GC string representing how much GC the user has.
		 */
		balance():string{throw OocError;},

		/**
		 * Shows transactions that has taken place
		 */
		transactions(args:TransactionArgs):string{throw OocError;}
	}
};

 /**
  * Typed MIDSEC
  */
export const $ms = {
	accts: {
		/**
		 * Transfer Gc to user
		 * 
		 * @param args.to User
		 * @param args.ammout A GC string or a number in raw GC
		 * @param args.memo The memo you want to give to the person. Between 1-50 chars. Optional.
		 */
		xfer_gc_to(args:{to:string, ammount:number|string, memo?:string}):string{throw OocError;}
	},

	chats: {
		channels(args:object){throw OocError;},
		join(args:object){throw OocError;},
		leave(args:object){throw OocError;},
		users(args:object){throw OocError;}
	},

	market: {
		buy(args:object){throw OocError;},
		stats(args:object){throw OocError;}
	}
};

/**
 * Typed LOWSEC
 */
export const $ls = {
	market: {
		sell(args:object){throw OocError;}
	}
};

/**
 * Typed NULLSEC
 */
export const $ns = {
	trust:{
		/**
		 * Possibly an easter egg.
		 */
		me:()=>{return "Thank You."}
	}
};

/**
 * Untyped FULLSEC
 */
export const $4s = Scrpr;

/**
 * Untyped HIGHSEC
 */
export const $3s = Scrpr;

/**
 * Untyped LOWSEC
 */
export const $2s = Scrpr;

/**
 * Untyped NULLSEC
 */
export const $1s = Scrpr;

/**
 * The final output of $db.f
 */
interface $findChain{
	/**
	 * Get the first maching object from the database.
	 */
	first():object;
	
	/**
	 * Get all mathinc objects from the database.
	 */
	array():object[];	
}

/**
 * The list of update operations that can be applied to $db.u
 * @todo Find out about more update operations. The only one I currently know about is $set.
 */
interface updateOper {
	$set:object
}

export class $db {
	/**
	 * Inserts a new document or documents.
	 * @param obj An object or array of objects to pass.
	 */
	static i(obj:object|object[]):void{}

	/**
	 * Removes any documents matching the query
	 */
	static r(query:object):void{}

	/**
	 * Returns any documents matching the query.
	 */
	static f(query:object, projection?:object):$findChain{throw OocError};

	/**
	 * Updates any pre-existing documents matching the query.
	 */
	static u(query:object, update:{upOp:updateOper}):void{}
}

/**
 * Specifies a time before the scripts start.
 * Find out how much time you have left by doing `Date.now()-_START`
 */
export const _START = Date.now();
/**
 * The number of miliseconds a program has to run.
 * Allways 5000 except for trust scripts.
 * Since you aren't trust, you are stuck with 5000.
 */
export const _TIMEOUT = 5000;

/**
 * Hackmud's global variable.
 * Starts out empty but you can add to it if you like.
 */
export var $G = {};

export const JSON = {
	stringify(object:object, error?:any, replacer?:any, space?:string):string {
		return '';
	},

	parse(string:string, error?:any, reviver?:any):object {
		return {};
	}
}

let executed = false;

/**
 * The Function Multi Call Lock (FMCL) prevents mutliple calls from one function.
 * If it's executed once, it returns falsy, else it returns truthy.
 */
export var $FMCL = {
	get() {
		let temp = executed;
		if(!executed){
			executed = true;
		}

		return temp;
	}
}