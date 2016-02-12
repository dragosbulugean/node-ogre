'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.remove = exports.save = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Constants = require('./Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

var _StringGenerator = require('./StringGenerator');

var _StringGenerator2 = _interopRequireDefault(_StringGenerator);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sg = new _StringGenerator2.default(); /**
                                           * Created by Dragos on 8/19/14.
                                           */

var txn_save_one = function txn_save_one(txn, model) {
	var data = model.generateDataForPersistence();
	var m1 = txn.save(data, function (err, node) {
		if (!_lodash2.default.isUndefined(node)) {
			model.id = node.id;
		}
	});
	if (!_lodash2.default.isNumber(model.id)) {
		m1 = txn.label(m1, model.label);
	}
	return m1;
};

var txn_save_relation = function txn_save_relation(txn, id1, id2, relationType) {
	if (!(txn && id1 && id2 && relationType)) {
		throw Error('Supply txn id1 id2 and relationtype to txn_save_relation');
	}
	if (!_lodash2.default.isNumber(id1) || !_lodash2.default.isNumber(id2) || !_lodash2.default.isString(relationType)) {
		throw Error('Wrong type for id1, id2 or relationType');
	}
	txn.relate(id1, relationType, id2);
	return txn;
};

var txn_delete_relation = function txn_delete_relation(txn, model1Id, model2Type, relationType) {
	if (!(txn && model1Id && model2Type && relationType)) {
		throw Error('Supply txn model1Id, model2Type and relationtype.');
	}
	var deleteRelationQuery = 'START n=node(' + model1Id + ') ' + ('MATCH (n)-[rel:' + relationType + ']-(r:' + model2Type + ') ') + 'DELETE rel';
	txn.query(deleteRelationQuery);
	return txn;
};

var save = function save(model, relationed) {
	var deferred = _bluebird2.default.defer();

	if (relationed) relationed = _lodash2.default.intersection(relationed, model.getRelationFields());else relationed = model.getRelationFields();

	if (!model.data) {
		return deferred.reject(model.getNotInstantiatedError());
	}

	var delete_relations_batch = model.seraph().batch();
	//delete existing relations if not new
	if (model.id) {
		relationed.forEach(function (r) {
			var model1Id = model.id;
			var model2Label = model.definition[r].type.to.label;
			var relationType = model.definition[r].type.relationType;
			txn_delete_relation(delete_relations_batch, model1Id, model2Label, relationType);
		});
	}

	delete_relations_batch.commit(function (err, results) {
		if (err) {
			return deferred.reject(err);
		}

		var save_models_batch = model.seraph().batch();
		var txn_model1 = txn_save_one(save_models_batch, model);

		_lodash2.default.each(relationed, function (field) {
			if (model[field]) {
				if (model.definition[field].type instanceof _FieldTypes2.default.OneRelation) {
					if (!_lodash2.default.isNumber(model[field])) txn_save_one(save_models_batch, model[field]);
				} else if (model.definition[field].type instanceof _FieldTypes2.default.ManyRelation) {
					model[field].forEach(function (m) {
						if (!_lodash2.default.isNumber(m)) txn_save_one(save_models_batch, m);
					});
				}
			}
		});

		save_models_batch.commit(function (err, results) {
			if (err) {
				return deferred.reject(err);
			}

			var save_relations_batch = model.seraph().batch();

			_lodash2.default.each(relationed, function (field) {
				if (model[field]) {
					if (model.definition[field].type instanceof _FieldTypes2.default.OneRelation) {
						var relationType = model.definition[field].type.relationType;
						var id2 = model[field].id || model[field];
						txn_save_relation(save_relations_batch, model.id, id2, relationType);
					} else if (model.definition[field].type instanceof _FieldTypes2.default.ManyRelation) {
						model[field].forEach(function (m) {
							var relationType = model.definition[field].type.relationType;
							var ids = model[field].map(function (item) {
								return item.id || item;
							});

							ids.forEach(function (item) {
								txn_save_relation(save_relations_batch, model.id, item, relationType);
							});
						});
					}
				}
			});

			save_relations_batch.commit(function (err, results) {
				if (err) {
					return deferred.reject(err);
				}
				return deferred.resolve(model);
			});
		});
	});

	return deferred.promise;
};

var remove = function remove(model, hard) {

	var deferred = _bluebird2.default.defer();

	if (_lodash2.default.isUndefined(model.id)) {
		process.nextTick(function () {
			return deferred.reject('Models need to be saved before deletion.');
		});
	}

	if (hard) {
		model.seraph().delete(model.id, true, function (err, node) {
			model.isSyncronised = true;
			return deferred.resolve(model);
		});
	} else {
		model.seraph().label(model.id, ['_' + model.label], true, function (err, node) {
			model.isSyncronised = true;
			return deferred.resolve(model);
		});
	}

	return deferred.promise;
};

exports.save = save;
exports.remove = remove;