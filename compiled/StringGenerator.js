'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Dragos on 6/5/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Constants = require('./Constants');

var Constants = _interopRequireWildcard(_Constants);

var _MapNameUtility = require('./MapNameUtility');

var _MapNameUtility2 = _interopRequireDefault(_MapNameUtility);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StringGenerator = function () {
	function StringGenerator() {
		_classCallCheck(this, StringGenerator);

		this.names = new _MapNameUtility2.default();
		this.relationMap = {};
	}

	_createClass(StringGenerator, [{
		key: 'getDirection',
		value: function getDirection(direction, relationType, variable, inverse) {
			if (!direction || !relationType) throw Error('Please supply direction and relationType to the function.');
			if (!variable) variable = '';
			var inDirection = false;
			var outDirection = false;
			if (direction.indexOf(Constants.Directions.In) > -1) inDirection = true;
			if (direction.indexOf(Constants.Directions.Out) > -1) outDirection = true;
			var str = (inDirection == true ? Constants.Directions.In : '') + ('-[' + variable + ':' + relationType + ']-') + (outDirection == true ? Constants.Directions.Out : '');
			return str;
		}
	}, {
		key: 'getMap',
		value: function getMap(mapName, propertiesList, selectList, isIdSupplied) {
			var query = [];
			propertiesList.forEach(function (v, k) {
				if (v === 'id') {
					if (isIdSupplied) {
						query.push('id:' + mapName + '.id');
						return;
					}
					query.push('id:id(' + mapName + ')');
					return;
				}
				if (selectList && selectList.length !== 0) {
					if (selectList.indexOf(v) !== -1) {
						query.push(v + ':' + mapName + '.' + v);
					}
				} else {
					query.push(v + ':' + mapName + '.' + v);
				}
			}, this);
			return query.join(', ');
		}
	}, {
		key: 'getWith',
		value: function getWith(usedMapNames, mapName, nextMapName, propertiesList, selectList) {
			var query = 'WITH ' + usedMapNames + '{' + this.getMap(mapName, propertiesList, selectList, false) + ('} AS ' + nextMapName + ' ');
			return query;
		}
	}, {
		key: 'getWithFromRelation',
		value: function getWithFromRelation(usedMapNames, relationMapName, nextRelationMapName, propertiesList, selectList) {
			var query = 'WITH ' + usedMapNames + '{' + this.getMap(relationMapName, propertiesList, selectList, false) + ('} AS ' + nextRelationMapName + ' ');
			return query;
		}
	}, {
		key: 'getEmbeddedWith',
		value: function getEmbeddedWith(usedMapNames, lastMapName, primitivesList, relationPropertiesList, selectList, relationMap) {
			var query = 'WITH ' + usedMapNames + ' {' + this.getMap(lastMapName, primitivesList, selectList, true) + ' ';
			var partialQuery = [];
			for (var relation in relationMap) {
				partialQuery.push(relation + ':' + relationMap[relation]);
			}
			return query + partialQuery.join(', ');
		}
	}, {
		key: 'getMatch',
		value: function getMatch(modelName, mapName) {
			if (modelName) return 'MATCH (' + mapName + ':' + modelName + ') ';
			return 'MATCH (' + modelName + ') ';
		}
	}, {
		key: 'getWhereId',
		value: function getWhereId(mapName, id) {
			return 'WHERE id(' + mapName + ')=' + id + ' ';
		}
	}, {
		key: 'getReturn',
		value: function getReturn(mapName, propList, selectList, isIdSupplied, nextMapName) {
			var returnQuery = 'RETURN DISTINCT {' + this.getMap(mapName, propList, selectList, isIdSupplied);
			for (var relation in this.relationMap) {
				returnQuery += ', ' + relation + ':' + this.relationMap[relation];
			}
			returnQuery += '} as ' + nextMapName;
			return returnQuery;
		}
	}, {
		key: 'getCount',
		value: function getCount(mapName) {
			if (!mapName) throw Error('Please supply mapName to function.');
			return 'RETURN count(' + mapName + ')';
		}
	}, {
		key: 'getRange',
		value: function getRange(skip, limit) {
			var query = [];
			if (skip) query.push('SKIP ' + skip);
			if (limit) query.push('LIMIT ' + limit);
			return query.join(' ');
		}
	}, {
		key: 'getRevertedNodesFromMap',
		value: function getRevertedNodesFromMap(currentMapName, lastMapName, label) {
			var query = this.getMatch(label, currentMapName) + this.getWhereId(currentMapName, lastMapName) + '.id';
			return query;
		}
	}, {
		key: 'getRelationMatch',
		value: function getRelationMatch(currentMapName, currentRelationMapName, label, def) {
			var query = this.getMatch(label, currentMapName) + this.getDirection(def.type.direction, def.type.relationType) + '(' + currentRelationMapName + ':' + def.type.to.label + ') ';
			return query;
		}
	}, {
		key: 'getOptionalRelationMatch',
		value: function getOptionalRelationMatch(currentMapName, currentRelationMapName, label, definition) {
			var query = 'OPTIONAL ' + this.getRelationMatch(currentMapName, currentRelationMapName, label, definition);
			return query;
		}
	}, {
		key: 'getCreate',
		value: function getCreate(modelLabel, modellet, modelDataVar) {
			var query = 'CREATE (' + modellet + ':' + modelLabel + ' {' + modelDataVar + '}) ';
			return query;
		}
	}, {
		key: 'getOrderBy',
		value: function getOrderBy(mapName, fields, direction) {
			if (!mapName || !fields || !direction) throw Error('Supply mapName|field|direction to this function.');
			if (direction != 'ASC' && direction != 'DESC') throw Error('Supply direction with value ASC|DESC.');
			var efs = [];
			_lodash2.default.each(fields, function (field) {
				efs.push(mapName + '.' + field);
			});
			var query = 'ORDER BY ' + efs.join(', ') + ' ' + direction;
			return query;
		}
	}, {
		key: 'getWhere',
		value: function getWhere(mapName, operator, field, value, continuation) {
			var initial = undefined;
			operator = operator.toUpperCase();
			if (!continuation) initial = 'WHERE ';else initial = continuation.trim() + ' ';

			if (operator == Constants.Operators.in) value = JSON.stringify(value);else if (!_lodash2.default.isNumber(value) && !_lodash2.default.isBoolean(value)) value = '"' + value + '"';

			if (field == "id") return initial + 'id(' + mapName + ') ' + operator + ' ' + value;

			return '' + initial + mapName + '.' + field + ' ' + operator + ' ' + value;
		}
	}]);

	return StringGenerator;
}();

exports.default = StringGenerator;