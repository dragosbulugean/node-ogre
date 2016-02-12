'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getData = exports.serializeModels = exports.serializeModel = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Created by Dragos on 6/30/14.
 */

var serializeModel = function serializeModel(model) {
	if (!model) return;
	if (model.data) model = model.data;
	var json = JSON.stringify(model);
	return json;
};

var serializeModels = function serializeModels(models) {
	if (models.length == 0) return '[]';
	var json = [];
	for (var model in models) {
		model = models[model];
		json.push(serializeModel(model));
	}
	var serialized = '[' + json.join(',') + ']';
	return serialized;
};

var getData = function getData(modelOrModels) {
	if (_lodash2.default.isArray(modelOrModels)) {
		return _lodash2.default.map(modelOrModels, function (model) {
			return getModelData(model);
		});
	} else {
		return getModelData(modelOrModels);
	}
};

var getModelData = function getModelData(model) {
	var data = {};
	_lodash2.default.each(_lodash2.default.keys(model.data), function (key) {
		if (model.definition[key].type instanceof _FieldTypes2.default.OneRelation) {
			if (model[key] === null) data[key] = null;else data[key] = model[key].data || model[key];
		} else if (model.definition[key].type instanceof _FieldTypes2.default.ManyRelation) {
			(function () {
				var arrayData = [];
				_lodash2.default.each(model[key], function (m) {
					arrayData.push(m.data || m);
				});
				data[key] = arrayData;
			})();
		} else {
			data[key] = model[key];
		}
	});
	return data;
};

exports.serializeModel = serializeModel;
exports.serializeModels = serializeModels;
exports.getData = getData;