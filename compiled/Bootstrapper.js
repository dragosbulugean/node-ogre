'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Dragos on 6/4/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

var _Constants = require('./Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _Utils = require('./Utils');

var utils = _interopRequireWildcard(_Utils);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _seraph2 = require('seraph');

var _seraph3 = _interopRequireDefault(_seraph2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//Framework bootstrapper that loads models,
//and makes sure the definitions are right.

var Bootstrapper = function () {
	function Bootstrapper(models) {
		_classCallCheck(this, Bootstrapper);

		if (!_lodash2.default.isUndefined(models)) {
			utils.checkModels(models);
			this._models = models;
		}
	}

	_createClass(Bootstrapper, [{
		key: 'models',
		value: function models(_models) {
			if (_lodash2.default.isUndefined(_models)) return this._models;
			utils.checkModels(_models);
			this._models = _models;
			return this;
		}
	}, {
		key: 'debugMode',
		value: function debugMode(flag) {
			if (_lodash2.default.isUndefined(flag)) return this.__debugMode;
			this.__debugMode = flag;
			return this;
		}
	}, {
		key: 'db',
		value: function db(_db) {
			if (_lodash2.default.isUndefined(_db)) throw Error('Please provide db.');
			this.seraph((0, _seraph3.default)(_db));
			return this;
		}
	}, {
		key: 'seraph',
		value: function seraph(_seraph) {
			if (_lodash2.default.isUndefined(_seraph)) return this.__seraph;
			this.__seraph = _bluebird2.default.promisifyAll(_seraph);
			return this;
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			var _this = this;

			//Verify relations
			var seraph = this.seraph();
			_lodash2.default.each(this.models(), function (model) {
				//set seraph
				model.setSeraph(seraph);
				_lodash2.default.each(model.definition, function (definition) {
					if (!definition.type) {
						throw Error(model.label + ' must define types for all properties!');
					} else {
						if (definition.type instanceof _FieldTypes2.default.OneRelation || definition.type instanceof _FieldTypes2.default.ManyRelation) {
							var modelExists = false;
							_this._models.forEach(function (submodel) {
								if (definition.type.to === submodel || definition.type.to === submodel.label) {
									modelExists = true;
									definition.type.to = submodel;
								}
							});
							if (!modelExists) throw Error(definition.type.to + ' does not exist ' + ('and cannot be tied to ' + model.label + '!'));
						}
					}
				}, _this);
			}, this);
			if (this.debugMode()) {
				console.log("OGRE is alive.");
			}
		}
	}]);

	return Bootstrapper;
}();

exports.default = Bootstrapper;