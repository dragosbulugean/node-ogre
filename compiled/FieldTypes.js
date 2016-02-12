'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Constants = require('./Constants');

var Constants = _interopRequireWildcard(_Constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var FieldTypes = {

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
	OneRelation: function OneRelation(options) {
		if (!(options && options.to)) throw Error('Invalid relation definition!');
		this.to = options.to;
		this.relationType = options.relationType || 'has';
		this.direction = options.direction || Constants.Directions.Out;
	},

	//Multiple relations between nodes. Sort of like one-to-many in RDBMS
	ManyRelation: function ManyRelation(options) {
		if (!(options && options.to)) throw Error('Invalid relation definition!');
		this.to = options.to;
		this.relationType = options.relationType || 'has';
		this.direction = options.direction || Constants.Directions.Out;
	}
}; /**
    * Created by Dragos on 7/9/14.
    *
    * All data types we support in OGRE
    */

exports.default = FieldTypes;