'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Created by Dragos on 7/9/14.
 */

//Directions to use in definition of model relations
var Directions = {
	In: '<',
	Out: '>',
	InOut: '<>'
};

//Operators to use in definition of WHERE clauses in QueryBuilder
var Operators = {
	'and': 'AND',
	'or': 'OR',
	'in': 'IN',
	'eq': '=',
	'neq': '<>',
	'gt': '>',
	'lt': '<',
	'gte': '>=',
	'lte': '<=',
	'regex': '=~',
	'n': 'IS NULL',
	'nn': 'IS NOT NULL'
};

exports.Directions = Directions;
exports.Operators = Operators;