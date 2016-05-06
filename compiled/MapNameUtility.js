'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Dragos on 6/3/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

//This module helps keep sanity in map naming in queries.


var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Neo4jMapNameUtility = function () {
	function Neo4jMapNameUtility() {
		_classCallCheck(this, Neo4jMapNameUtility);
	}

	_createClass(Neo4jMapNameUtility, [{
		key: 'regulate',
		value: function regulate(mapName, number) {
			return this[mapName].split('_')[0] + '_' + (parseInt(this[mapName].split('_')[1]) + number);
		}
	}, {
		key: 'getCurrentMapName',
		value: function getCurrentMapName() {
			return this.currentMapName;
		}
	}, {
		key: 'getLastMapName',
		value: function getLastMapName() {
			if (!this.currentMapName) return;
			var lastMapName = this.regulate('currentMapName', -1);
			return lastMapName;
		}
	}, {
		key: 'setGetLastMapName',
		value: function setGetLastMapName() {
			if (!this.currentMapName) return;
			var lastMapName = this.regulate('currentMapName', -1);
			this.currentMapName = lastMapName;
			return lastMapName;
		}
	}, {
		key: 'getNextMapName',
		value: function getNextMapName() {
			if (!this.currentMapName) return 'm_0';
			var nextMapName = this.regulate('currentMapName', +1);
			return nextMapName;
		}
	}, {
		key: 'setGetNextMapName',
		value: function setGetNextMapName() {
			if (!this.currentMapName) return this.currentMapName = 'm_0';
			var nextMapName = this.regulate('currentMapName', +1);
			this.currentMapName = nextMapName;
			return nextMapName;
		}
	}, {
		key: 'getCurrentRelationMapName',
		value: function getCurrentRelationMapName() {
			return this.currentRelationMapName;
		}
	}, {
		key: 'getNextRelationMapName',
		value: function getNextRelationMapName() {
			if (!this.currentRelationMapName) return 'rm_0';
			var lastRelationMapName = this.regulate('currentRelationMapName', +1);
			return lastRelationMapName;
		}
	}, {
		key: 'setGetNextRelationMapName',
		value: function setGetNextRelationMapName() {
			if (!this.currentRelationMapName) return this.currentRelationMapName = 'rm_0';
			var nextRelationMapName = this.regulate('currentRelationMapName', +1);
			this.currentRelationMapName = nextRelationMapName;
			return nextRelationMapName;
		}
	}, {
		key: 'getMapNames',
		value: function getMapNames(current, list) {
			if (!this.currentMapName) return;
			if (!list) list = [];
			if (!current) current = this.currentMapName;
			var nr = parseInt(current.split('_')[1]);
			if (nr >= 0) {
				list.push(current);
				current = 'm_' + (nr - 1);
				this.getMapNames(current, list);
			}
			return list;
		}
	}, {
		key: 'getRelationMapNames',
		value: function getRelationMapNames(current, list) {
			if (!this.currentRelationMapName) return;
			if (!list) list = [];
			if (!current) current = this.currentRelationMapName;
			if (!current) return list;
			var nr = parseInt(current.split('_')[1]);
			if (nr >= 0) {
				list.push(current);
				current = 'rm_' + (nr - 1);
				this.getRelationMapNames(current, list);
			}
			return list;
		}
	}, {
		key: 'getAllUsedMapNames',
		value: function getAllUsedMapNames() {
			var l1 = this.getMapNames() || [];
			var l2 = this.getRelationMapNames() || [];
			var value = [].concat(l1).concat(l2) + ',';
			return value;
		}
	}, {
		key: 'getAllUsedMapNamesWithout',
		value: function getAllUsedMapNamesWithout(mapName) {
			var l1 = this.getMapNames() || [];
			l1 = _lodash2.default.difference(l1, [mapName]);
			var l2 = this.getRelationMapNames() || [];
			l2 = _lodash2.default.difference(l2, [mapName]);
			var value = [].concat(l1).concat(l2) + ',';
			return value;
		}
	}, {
		key: 'reset',
		value: function reset() {
			delete this.currentMapName;
			delete this.currentRelationMapName;
		}
	}]);

	return Neo4jMapNameUtility;
}();

exports.default = Neo4jMapNameUtility;