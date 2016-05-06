/**
 * Created by Dragos on 7/9/14.
 *
 * All data types we support in OGRE
 */

import * as Constants from './Constants'

let FieldTypes = {

	//Integers, doubles, floats
	Number: Number,

	//Flags
	Boolean: Boolean,

	//The bread and butter type
	String: String,

	//This type is for persisting complex javascript objects.
	//The engine serializes to string and deserializes from string,
	//making it transparent to the user.
	JSON: JSON,

	//Date or moment.js instance.
	//The engine persists a unix timestamp of the instance,
	//and reconstructs a Date object when getting data.
	Date: Date,

	//Array of primitives: strings or numbers. Unfortunately list elements
	//have to be of the same type (Neo4j limitation, Java limitation)
	Array: Array,

	//Singular relation between nodes. Sort of like one-to-one in RDBMS
	OneRelation: class OneRelation {
		constructor(options) {
			if (!(options && options.to)) throw Error('Invalid relation definition!')
			this.to = options.to
			this.relationType = options.relationType || 'has'
			this.direction = options.direction || Constants.Directions.Out
		}
	},

	//Multiple relations between nodes. Sort of like one-to-many in RDBMS
	ManyRelation: class ManyRelation {
		constructor(options) {
			if (!(options && options.to)) throw Error('Invalid relation definition!')
			this.to = options.to
			this.relationType = options.relationType || 'has'
			this.direction = options.direction || Constants.Directions.Out
		}
	}
}

export default FieldTypes
