'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.validateTypes = exports.validateType = exports.validateModel = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                   * Created by Dragos on 8/27/14.
                                                                                                                                                                                                                                                   */

var _Constants = require('./Constants');

var Constants = _interopRequireWildcard(_Constants);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var validateModel = function validateModel(model) {
	var messages = validateTypes(model);
	return messages;
};

var validateTypes = function validateTypes(model) {
	var messages = [];
	for (var key in model.data) {
		if (model.data.hasOwnProperty(key)) {
			var result = validateType(model.definition[key].type, model[key]);
			if (result) messages.push(result);
		}
	}
	return messages;
};

//Not working yet
var validateType = function validateType(type, value) {
	return; //test
	var passed = false;
	if (type == _FieldTypes2.default.String) {
		if (typeof value == 'string') passed = true;
		if (typeof value == 'number') passed = true; //fix this someday TODO
	} else if (type == _FieldTypes2.default.Number) {
		if (typeof value == 'number') passed = true;
		if (typeof parseInt(value) == 'number') passed = true; //fix this someday TODO
	} else if (type == _FieldTypes2.default.Boolean) {
		if (typeof value == 'boolean') passed = true;
	} else if (type == _FieldTypes2.default.Date) {
		if (value instanceof _FieldTypes2.default.Date) passed = true;else if (value._isAMomentObject) passed = true;
	} else if (type == _FieldTypes2.default.JSON) {
		if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object') passed = true;
	} else if (type == _FieldTypes2.default.Array) {
		if (value instanceof Array) passed = true;
	} else if (type instanceof _FieldTypes2.default.OneRelation) {
		passed = true;
	} else if (type instanceof _FieldTypes2.default.ManyRelation) {
		passed = true;
	}

	if (_lodash2.default.isNull(value)) passed = true;

	if (passed) return;else return 'Value ' + value + ' is not of type ' + type + '.';
};

exports.validateModel = validateModel;
exports.validateType = validateType;
exports.validateTypes = validateTypes;