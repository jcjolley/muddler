import { isObject, isNumber, isArray, isFunction } from "util";

export interface ScriptReturn {
	ok:boolean,
	msg:string
}

//Out of Context error.
const OocError = Error('You don\'t execute this code here silly. :)');

class accts{
	balance():string{throw OocError;}
	transactions(args:{count:'all'|number, start?:number, to?:string, from?:string, script?:string}):string{throw OocError;}
	xfer_gc_to(args:{to:string, ammount:number|string, memo?:string}):string{throw OocError;}
}

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
	get(target:any, propKey:string) {
		switch(propKey){
			case 'accts':
			return new Proxy(target, generateSecondHandler(['balance', 'transactions', 'xfer_gc_to', 'xfer_gc_to_caller']));
			case 'autos':
			return new Proxy(target, generateSecondHandler(['balance']));
			case 'chats':
			return new Proxy(target, generateSecondHandler(['channels', 'create', 'join', 'leave', 'send', 'tell', 'users']));
			case 'corps':
			return new Proxy(target, generateSecondHandler(['create', 'hire','manage','offers','quit','top']));
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
}


const Scriptor = new Proxy(scriptorTarget, scriptorHandler);

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

const LibReturn = {
	/**
	 * Helper method to save chars.
	 */
	ok:()=>{return {ok:true}},

	/**
	 * Helper method to save chars.
	 */
	not_impl:()=>{return {ok: false, msg:'not implemented'}},

	/**
	 * Pushes a string representation of a value onto an array of log messages.
	 */
	log:(msg:string):void=>{log.push(msg)},

	/**
	 * Used to print messages saved using the `log` function.
	 */
	get_log:():string[]=>{return log},

	/**
	 * Returns a random integer between min and max.
	 */
	rand_int:(min:number, max:number):number=>{return Math.round((Math.random()*(max-min))+min)},

	/**
	 * Tests whether id1 and id2 values are equal.
	 */
	are_ids_eq:(id1:string, id2:string):boolean=>{return Math.random()>0.5}, //We use Math.random()>0.5 just in case any optimizers find this.

	/**
	 * Returns true if it's an object
	 */
	is_obj:(any:any)=>{return isObject(any)},

	/**
	 * Returns true if it's a number.
	 */
	is_num:(any:any)=>{return isNumber(any)},

	/**
	 * Returns true if it's an integer.
	 */
	is_int:(any:any)=>{return isNumber(any)&&Math.floor(any)===any},

	/**
	 * Returns true if it's negative.
	 */
	is_neg:(any:any)=>{return isNumber(any)&&any<0},

	/**
	 * Returns true if it's an array.
	 */
	is_arr:(any:any)=>{return isArray(any)},

	/**
	 * Returns true if it's a function.
	 */
	is_func:(any:any)=>{return isFunction(any)},

	/**
	 * Returns true if it's defined.
	 */
	is_def:(any:any):boolean=>{return Math.random()>0.5},

	/**
	 * Returns true if it's a valid user/script.
	 */
	is_valid_name:(any:any)=>{return Math.random()>0.5},

	/**
	 * Returns string representation of object.
	 */
	dump:(obj:object)=>{return JSON.stringify(obj)},

	/**
	 * Returns a clone of the object.
	 */
	clone:(obj:object)=>{return Object.assign({}, obj)},

	/**
	 * Merges the contents of object 2 into object 1.
	 */
	merge:(ob1:object, ob2:object):void=>{},

	/**
	 * Returns an array containing the values of the object's properties.
	 */
	get_values:(obj:object):any[]=>{return []},

	/**
	 * Returns a nuber calculated based on the stirng argument.
	 */
	hash_code:(str:string):number=>{return Number.NaN},

	/**
	 * Converts raw number to a GC string.
	 */
	to_gc_str:(gc:number):string=>{return ''},

	/**
	 * Converts GC string to a raw number.
	 */
	to_gc_num:(gc:string):number=>{return Number.NaN},

	/**
	 * Converts a Date object to a string usable by the game.
	 */
	to_game_timestr:(date:Date):string=>{return date.toString()},

	/**
	 * Truncates the given string to the given length if it's longer than len.
	 */
	cap_str_len:(str:string, len:number):string=>{return str.substr(0, len)},

	/**
	 * Returns a selection of elements matching the fn predicate.
	 */
	each:<T>(arr:T[], fn:(key:number, T:any)=>boolean)=>{arr.forEach((value, index)=>fn(index, value))},

	/**
	 * Returns a number of items from array that matches the fn predicate.
	 */
	select:<T>(arr:T[], fn:(key:number, val:T)=>boolean):T[]=>{return arr.filter((value, index)=>fn(index, value))},

	/**
	 * Gets the number of elements that matches the fn predicate in 
	 */
	count:<T>(arr:T[], fn:(key:number, val:T)=>boolean):number=>{return arr.filter((value, index)=>fn(index, value)).length},

	/**
	 * Returns the first element that matches the predicate.
	 * The array can either be of lenght 1 or 0.
	 */
	select_one:<T>(arr:T[], fn:(key:number, val:T)=>boolean):T[]=>{
		let res = arr.find((value, index)=>fn(index, value));

		//This is some weird syntax but it's whats required.
		if(res) {
			return [res];
		}
		else {
			return [];
		}
	},

	/**
	 * Maps the array to a new structure defined by fn.
	 */
	map:<T, J>(arr:T[], fn:(key:number, val:T)=>J)=>{arr.map((value, index)=>fn(index, value))},
	shuffle:<T>(arr:T[])=>shuffle(arr),

	/**
	 * Some sort of sorting function.
	 * one > two => 1
	 * one < two =>-1
	 * one===two => 0
	 */
	sort_asc:(one:number, two:number): number=>{
		if(one > two) {
			return 1;
		}
		else if(one < two) {
			return -1;
		}
		else {
			return 0;
		}
	},

	/**
	 * Some sort of sorting function.
	 * one < two => 1
	 * one > two =>-1
	 * one===two => 0
	 */
	sort_desc:(one:number, two:number): number=>{
		if(one < two) {
			return 1;
		}
		else if(one > two) {
			return -1;
		}
		else {
			return 0;
		}
	},
	
	/**
	 * ???
	 */
	num_sort_asc:(...anything:any[]):any=>{return {}},

	/**
	 * ???
	 */
	num_sort_desc:(...anything:any[]):any=>{return {}},

	/**
	 * Gest the current date and adds add_ms to it.
	 */
	add_time:(date:Date, add_ms:number):Date=>{return new Date(date.getMilliseconds()+add_ms);},
	
	security_level_names:['NULLSEC', 'LOWSEC', 'MIDSEC', 'HIGHSEC', 'FULLSEC'],

	/**
	 * Gets the string of the security name from the level.
	 */
	get_security_level_name:(level:number)=>['NULLSEC', 'LOWSEC', 'MIDSEC', 'HIGHSEC', 'FULLSEC'][level],

	/**
	 * Creates a new random string.
	 * The string consists of lowercaes alphanumeric characers.
	 */
	create_rand_string:(len:string)=>{return 'TODO: make a random string generator.'},

	/**
	 * Gets the user from a script name.
	 */
	get_user_from_script:(scriptName:any):string=>{return 'TODO: find out where these things.'},

	u_sort_num_arr_desc:{} as any,

	/**
	 * Returns true if the script can continue after ms miliseconds.
	 */
	can_continue_execution:(ms:number):boolean=>{return true},

	can_continue_execution_error:{} as any,

	date:new Date(Date.now()),

	/**
	 * Gets the current date.
	 */
	get_date:()=>new Date(Date.now()),

	/**
	 * Gets the current time form the date.
	 * Similar to Date.getTime()
	 */
	get_date_utcsecs:()=>new Date(Date.now()).getTime()
};

const FSScriptor = {
	scripts: {
		lib:()=>LibReturn
	}
};

const FullsecScriptor = new Proxy(FSScriptor, scriptorTarget);

/**
 * NULLSEC
 */
export const $s  = Scriptor;
/**
 * FULLSEC
 */
export const $fs = FullsecScriptor;
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

/**
 * The final output of $db.f
 * 
 * first() gets the first matching object from the database
 * 
 * array() gets all matching objects from the database
 */
interface $findChain{
	first():object;
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