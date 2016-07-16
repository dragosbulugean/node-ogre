'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Dragos on 5/20/14
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _Constants = require('./Constants');

var _Constants2 = _interopRequireDefault(_Constants);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

var _Finders = require('./Finders');

var Finders = _interopRequireWildcard(_Finders);

var _PersistenceManager = require('./PersistenceManager');

var PersistenceManager = _interopRequireWildcard(_PersistenceManager);

var _ValidationManager = require('./ValidationManager');

var ValidationManager = _interopRequireWildcard(_ValidationManager);

var _Serializer = require('./Serializer');

var _Serializer2 = _interopRequireDefault(_Serializer);

var _Utils = require('./Utils');

var utils = _interopRequireWildcard(_Utils);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = function () {
	function Model(label, definition) {
		_classCallCheck(this, Model);

		//left here for legacy purposes
		this.label = label;
		this.definition = definition;

		this.meta = {
			label: label,
			definition: definition,
			primitiveFields: [],
			relationFields: [],
			oneRelationFields: [],
			manyRelationFields: []
		};

		// Separate relations into types
		for (var property in this.definition) {
			var _definition = this.definition[property];
			if (_definition.type instanceof _FieldTypes2.default.OneRelation) {
				this.meta.relationFields.push(property);
				this.meta.oneRelationFields.push(property);
			} else if (_definition.type instanceof _FieldTypes2.default.ManyRelation) {
				this.meta.relationFields.push(property);
				this.meta.manyRelationFields.push(property);
			} else {
				this.meta.primitiveFields.push(property);
			}
		}
	}

	_createClass(Model, [{
		key: 'getLabel',
		value: function getLabel() {
			return this.meta.label;
		}
	}, {
		key: 'getDefinition',
		value: function getDefinition() {
			return this.meta.definition;
		}
	}, {
		key: 'getRelationFields',
		value: function getRelationFields() {
			return this.meta.relationFields;
		}
	}, {
		key: 'getPrimitiveFields',
		value: function getPrimitiveFields() {
			return this.meta.primitiveFields;
		}
	}, {
		key: 'getOneRelationFields',
		value: function getOneRelationFields() {
			return this.meta.oneRelationFields;
		}
	}, {
		key: 'getManyRelationFields',
		value: function getManyRelationFields() {
			return this.meta.manyRelationFields;
		}
	}, {
		key: 'getAllFields',
		value: function getAllFields() {
			return _lodash2.default.union(this.primitiveFields, this.relationFields);
		}
	}, {
		key: 'instantiateHelper',
		value: function instantiateHelper() {
			var instance = new Model(this.label, this.definition);
			instance.meta = this.meta;
			instance.data = {};

			//Getters and setters synthetisation
			var properties = {};
			for (var definition in instance.definition) {
				properties[definition] = {
					get: utils.wrapGet(instance, definition),
					set: utils.wrapSet(instance, definition),
					enumerable: true,
					configurable: true
				};
			}
			Object.defineProperties(instance, properties);

			for (var def in instance.definition) {
				var _definition2 = instance.definition[def];
				if (_definition2.type instanceof _FieldTypes2.default.ManyRelation) instance.data[def] = [];
			}
			return instance;
		}
	}, {
		key: 'populate',
		value: function populate(data) {
			for (var k in data) {
				var v = data[k];
				this.set(k, v);
			}
		}
	}, {
		key: 'instantiate',
		value: function instantiate(data) {
			var instance = this.instantiateHelper(data);
			instance.populate(data);
			return instance;
		}
	}, {
		key: 'populateFromDatabaseData',
		value: function populateFromDatabaseData(data) {
			var _this = this;

			var _loop = function _loop(key) {
				if (data.hasOwnProperty(key)) {
					var value = data[key];
					if (!_lodash2.default.isNull(value)) {
						if (_this.definition.hasOwnProperty(key)) {

							if (_this.definition[key].type === _FieldTypes2.default.Date) {
								_this.set(key, new Date(value));
							} else if (_this.definition[key].type === _FieldTypes2.default.JSON) {
								_this.set(key, JSON.parse(value));
							} else if (_this.definition[key].type === _FieldTypes2.default.Array) {
								_this.set(key, value);
							} else if (_this.definition[key].type instanceof _FieldTypes2.default.OneRelation) {
								if (_lodash2.default.keys(value).length === 1) {
									_this[key] = value.id;
								} else {
									if (value.id) {
										_this[key] = _this.definition[key].type.to.instantiateFromDatabaseData(value);
									} else {
										_this[key] = null;
									}
								}
							} else if (_this.definition[key].type instanceof _FieldTypes2.default.ManyRelation) {
								_lodash2.default.each(value, function (item) {
									if (_lodash2.default.keys(item).length === 1) {
										if (item.id) _this[key].push(item.id);
									} else {
										if (item.id) _this[key].push(_this.definition[key].type.to.instantiateFromDatabaseData(item, true));
									}
								}, _this);
							} else {
								_this.set(key, value);
							}
						}
					} else {
						_this.set(key, value);
					}
				}
			};

			for (var key in data) {
				_loop(key);
			}
		}
	}, {
		key: 'instantiateFromDatabaseData',
		value: function instantiateFromDatabaseData(data) {
			var instance = this.instantiateHelper(data);
			instance.populateFromDatabaseData(data);
			return instance;
		}
	}, {
		key: 'generateDataForPersistence',
		value: function generateDataForPersistence() {
			var _this2 = this;

			var data = {};

			_lodash2.default.each(this.getPrimitiveFields(), function (field) {
				if (_this2[field] == null) {
					//Do nothing
				} else if (_this2.definition[field].type == _FieldTypes2.default.Date) {
					if (!_lodash2.default.isUndefined(_this2[field])) {
						if (_this2[field] instanceof Date) {
							data[field] = _this2[field].getTime();
						} else if (_this2[field]._isAMomentObject) {
							data[field] = _this2[field].toDate().getTime();
						}
					}
				} else if (_this2.definition[field].type == _FieldTypes2.default.JSON) {
					data[field] = JSON.stringify(_this2[field]);
				} else {
					data[field] = _this2[field];
				}
			}, this);

			return data;
		}

		//Low level Getters for data. Used inside properties

	}, {
		key: 'get',
		value: function get(property) {
			if (this.definition.hasOwnProperty(property)) {
				return this.data[property];
			}
			throw Error('No such property!');
		}

		//Low level Setters for data. Used inside properties

	}, {
		key: 'set',
		value: function set(property, value) {
			if (_lodash2.default.isUndefined(property) || _lodash2.default.isUndefined(value)) return this;
			if (!this.data) {
				throw Error('Model has not been instantiated, cannot set properties.');
			}

			if (_lodash2.default.includes(this.getPrimitiveFields(), property)) {
				if (_lodash2.default.isUndefined(ValidationManager.validateType(this.definition[property].type, value))) {
					this.data[property] = value;
					this.isSyncronised = false;
				} else {
					throw Error('Value ' + value + ' of property ' + property + ('does not match the type declared in ' + this.label + '!'));
				}
			} else if (_lodash2.default.includes(this.getRelationFields(), property)) {
				this.data[property] = value;
				this.isSyncronised = false;
			} else {
				throw Error('Property ' + property + ' not found in ' + this.label + '!');
			}
			return this;
		}
	}, {
		key: 'setSeraph',
		value: function setSeraph(seraph) {
			this.meta.seraph = seraph;
			return this;
		}
	}, {
		key: 'seraph',
		value: function seraph() {
			return this.meta.seraph;
		}
	}, {
		key: 'findById',
		value: function findById(id, selectList, embedList) {
			return Finders.findById(this, id, selectList, embedList);
		}
	}, {
		key: 'findByIdArray',
		value: function findByIdArray(idArray, selectList, embedList) {
			return Finders.findByIdArray(this, idArray, selectList, embedList);
		}
	}, {
		key: 'findAll',
		value: function findAll(selectList, embedList) {
			return Finders.findAll(this, selectList, embedList);
		}
	}, {
		key: 'findByExample',
		value: function findByExample(example, selectList, embedList) {
			return Finders.findByExample(this, example, selectList, embedList);
		}
	}, {
		key: 'findByQueryBuilder',
		value: function findByQueryBuilder(queryBuilder) {
			return Finders.findByQueryBuilder(this, queryBuilder);
		}
	}, {
		key: 'findByQueryString',
		value: function findByQueryString(queryString) {
			return Finders.findByQueryString(this, queryString);
		}
	}, {
		key: 'findRandom',
		value: function findRandom(number, selectList, embedList) {
			return Finders.findRandom(this, number, selectList, embedList);
		}
	}, {
		key: 'count',
		value: function count() {
			return Finders.count(this);
		}
	}, {
		key: 'save',
		value: function save(relationed) {
			return PersistenceManager.save(this, relationed);
		}
	}, {
		key: 'remove',
		value: function remove() {
			return PersistenceManager.remove(this, false);
		}
	}, {
		key: 'hardRemove',
		value: function hardRemove() {
			return PersistenceManager.remove(this, true);
		}
	}, {
		key: 'validate',
		value: function validate() {
			return ValidationManager.validateModel(this);
		}
	}, {
		key: 'serialize',
		value: function serialize() {
			return _Serializer2.default.serializeModel(this);
		}
	}]);

	return Model;
}();

exports.default = Model;