'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.findRandom = exports.count = exports.findByQueryString = exports.findByQueryBuilder = exports.findByExample = exports.findAll = exports.findByIdArray = exports.findById = undefined;

var _Utils = require('./Utils');

var utils = _interopRequireWildcard(_Utils);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _chance = require('chance');

var _chance2 = _interopRequireDefault(_chance);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _QueryBuilder = require('./QueryBuilder');

var _QueryBuilder2 = _interopRequireDefault(_QueryBuilder);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var executeSingle = utils.executeSingle; /**
                                          * Created by Dragos on 8/15/14.
                                          */

var executeMany = utils.executeMany;
var chance = new _chance2.default();

var findById = function findById(model, id, selectList, embedList) {
	var queryBuilder = new _QueryBuilder2.default();
	if (!isNaN(id)) id = parseInt(id);
	queryBuilder.model(model).id(id);
	if (selectList) queryBuilder.selectList(selectList);
	if (embedList) queryBuilder.embedList(embedList);
	var query = queryBuilder.getQuery();
	return executeSingle(model, query);
};

var findByIdArray = function findByIdArray(model, idArray, selectList, embedList) {
	var queryBuilder = new _QueryBuilder2.default();
	queryBuilder.model(model).idArray(idArray);
	if (selectList) queryBuilder.selectList(selectList);
	if (embedList) queryBuilder.embedList(embedList);
	var query = queryBuilder.getQuery();
	return executeMany(model, query);
};

var findAll = function findAll(model, selectList, embedList) {
	var queryBuilder = new _QueryBuilder2.default();
	queryBuilder.model(model);
	if (selectList) queryBuilder.selectList(selectList);
	if (embedList) queryBuilder.embedList(embedList);
	var query = queryBuilder.getQuery();
	return executeMany(model, query);
};

var findByExample = function findByExample(model, example, selectList, embedList) {
	var queryBuilder = new _QueryBuilder2.default();
	queryBuilder.model(model);
	if (selectList) queryBuilder.selectList(selectList);
	if (embedList) queryBuilder.embedList(embedList);
	Object.keys(example).forEach(function (key) {
		var clause = {
			operator: 'eq',
			field: key,
			value: example[key]
		};
		queryBuilder.addWhere(clause);
	});
	var query = queryBuilder.getQuery();
	return executeMany(model, query);
};

var findByQueryBuilder = function findByQueryBuilder(model, queryBuilder) {
	var query = queryBuilder.model(model).getQuery();
	return executeMany(model, query);
};

var findByQueryString = function findByQueryString(model, query) {
	return executeMany(model, query);
};

var count = function count(model) {
	var deferred = _bluebird2.default.defer();
	var queryBuilder = new _QueryBuilder2.default().model(model).isCount(true);
	model.seraph().query(queryBuilder.getQuery(), {}, function (err, count) {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(count);
	});
	return deferred.promise;
};

var findRandom = function findRandom(model, number, selectList, embedList) {
	var deferred = _bluebird2.default.defer();
	if (_lodash2.default.isUndefined(number) || number == 0) return deferred.reject('Please supply number of records you want to get back. >0');
	var countPromise = count(model);
	countPromise.then(function (count) {
		if (count < 1) return deferred.reject('There are no models of type: ' + model.label + ' in the db.');
		var random = chance.integer({ min: 0, max: count - number });
		var queryBuilder = new _QueryBuilder2.default().limit(number).skip(random);
		if (selectList) queryBuilder.selectList(selectList);
		if (embedList) queryBuilder.embedList(embedList);
		model.findByQueryBuilder(queryBuilder).then(function (models) {
			return deferred.resolve(models);
		}).catch(function (err) {
			return deferred.reject(err);
		});
	}).catch(function (err) {
		return deferred.reject(err);
	});
	return deferred.promise;
};

exports.findById = findById;
exports.findByIdArray = findByIdArray;
exports.findAll = findAll;
exports.findByExample = findByExample;
exports.findByQueryBuilder = findByQueryBuilder;
exports.findByQueryString = findByQueryString;
exports.count = count;
exports.findRandom = findRandom;