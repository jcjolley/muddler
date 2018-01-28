//TODO: Find out how to make good types for these.
export const $s:any = {};
export const $fs:any = {};
export const $ms:any = {};
export const $ls:any = {};
export const $ns:any = {};
export const $4s:any = {};
export const $3s:any = {};
export const $2s:any = {};
export const $1s:any = {};

//Out of Context error.
const OocError = Error('You don\'t execute this code here silly. :)');

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
	 * Creates inserts a new document or documents.
	 * @param obj An object or array of objects to pass.
	 */
	static i(obj:object|object[]):void{}

	/**
	 * Removes any documents matching the query
	 * @param obj
	 */
	static r(query:object):void{}

	/**
	 * Returns any documents matching the query.
	 */
	static f(query:object, projection?:object):$findChain{throw OocError};

	/**
	 * Updates any pre-existing documents matching the query.
	 * @param query 
	 */
	static u(query, update:{upOp:updateOper}):void{}
}