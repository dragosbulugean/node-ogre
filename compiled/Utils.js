'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.checkModels = exports.transformClauseFromOldSyntax = exports.checkClause = exports.executeMany = exports.executeSingle = exports.wrapGet = exports.wrapSet = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Constants = require('./Constants');

var Constants = _interopRequireWildcard(_Constants);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//Get & Set wrappers to fix scoping issues caused by defining properties
/**
 * Created by Dragos on 7/8/14
 */

var wrapSet = function wrapSet(instance, definition) {
	return function (newValue) {
		instance.set(definition, newValue);
	};
};

var wrapGet = function wrapGet(instance, definition) {
	return function () {
		return instance.get(definition);
	};
};

//Helper function to call when ending one queries.
var executeSingle = function executeSingle(model, query) {
	var deferred = _bluebird2.default.defer();
	model.seraph().queryAsync(query, {}).then(function (result) {
		if (!result || _lodash2.default.isEmpty(result)) {
			return deferred.reject(Error('Node not found!'));
		}
		var modelInstance = model.instantiateFromDatabaseData(result[0], true);
		modelInstance.isSyncronised = true;
		return deferred.resolve(modelInstance);
	}).catch(function (err) {
		return deferred.reject('Query: ' + query + ' ' + err);
	});
	return deferred.promise;
};

//Helper function to call when ending many queries.
var executeMany = function executeMany(model, query) {
	var deferred = _bluebird2.default.defer();
	model.seraph().queryAsync(query, {}).then(function (result) {
		var models = [];
		result.forEach(function (data) {
			//TODO solve this in neo4j-cypher
			if (data.metadata) {
				var id = data.metadata.id;
				data = data.data;
				data.id = id;
			}
			var modelInstance = model.instantiateFromDatabaseData(data);
			modelInstance.isSyncronised = true;
			models.push(modelInstance);
		});
		return deferred.resolve(models);
	}).catch(function (err) {
		return deferred.reject('Query: ' + query + ' ' + err);
	});

	return deferred.promise;
};

//Verify if clause has correct fields
var checkClause = function checkClause(clause) {
	if (_lodash2.default.isUndefined(clause.operator)) throw Error('You must supply a clause to the addWhere method.');
	var isOperatorSupported = false;
	_lodash2.default.each(Constants.Operators, function (v, k) {
		if (k === clause.operator) isOperatorSupported = true;
	});
	if (!isOperatorSupported) throw Error(clause.operator + ' is not a supported operator' + ('Supported operatos: ' + Constants.Operators));
	if (_lodash2.default.isUndefined(clause.field)) throw Error('You must supply a field on the clause.');
	if (_lodash2.default.isUndefined(clause.value)) throw Error('You must supply a value on the clause.');
};

//Make clauses work with RQL style syntax
var transformClauseFromOldSyntax = function transformClauseFromOldSyntax(clause) {
	return {
		operator: clause.op,
		field: clause.args[0],
		value: clause.args[1]
	};
};

var checkModels = function checkModels(models) {
	if (_lodash2.default.isArray(models)) {
		_lodash2.default.each(models, function (model) {
			if (!model.label) {
				throw Error('The model array should only contain Model instances.');
			}
		});
	} else throw Error('Please supply an array of models to this method.');
};

exports.wrapSet = wrapSet;
exports.wrapGet = wrapGet;
exports.executeSingle = executeSingle;
exports.executeMany = executeMany;
exports.checkClause = checkClause;
exports.transformClauseFromOldSyntax = transformClauseFromOldSyntax;
exports.checkModels = checkModels;