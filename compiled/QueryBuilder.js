'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by Dragos on 5/19/14.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _MapNameUtility = require('./MapNameUtility');

var _MapNameUtility2 = _interopRequireDefault(_MapNameUtility);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _FieldTypes = require('./FieldTypes');

var _FieldTypes2 = _interopRequireDefault(_FieldTypes);

var _Constants = require('./Constants');

var Constants = _interopRequireWildcard(_Constants);

var _Model = require('./Model');

var _Model2 = _interopRequireDefault(_Model);

var _Utils = require('./Utils');

var utils = _interopRequireWildcard(_Utils);

var _StringGenerator = require('./StringGenerator');

var _StringGenerator2 = _interopRequireDefault(_StringGenerator);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var names = new _MapNameUtility2.default();
var sg = new _StringGenerator2.default();

//Constructor

var Neo4jQueryBuilder = function () {
  function Neo4jQueryBuilder() {
    _classCallCheck(this, Neo4jQueryBuilder);

    this._embedList = [];
    this._selectList = [];
    this._orderBy = { fields: ['id'], direction: 'ASC' }; //default orderby
    this.whereClauses = [];
    this.subWhereClauses = {};
    this.names = new _MapNameUtility2.default();
    this.sg = new _StringGenerator2.default();
  }

  _createClass(Neo4jQueryBuilder, [{
    key: 'model',
    value: function model(_model) {
      if (_lodash2.default.isUndefined(_model)) return this._model;
      this._model = _model;
      return this;
    }
  }, {
    key: 'id',
    value: function id(_id) {
      if (_lodash2.default.isUndefined(_id)) return this._id;
      if (this._idArray) throw Error('QueryBuilder needs to have either id or idArray.');
      this._id = _id;
      return this;
    }
  }, {
    key: 'idArray',
    value: function idArray(_idArray) {
      if (_lodash2.default.isUndefined(_idArray)) return this._idArray;
      if (this._id) throw Error('QueryBuilder needs to have either id or idArray.');
      this._idArray = _idArray;
      return this;
    }
  }, {
    key: 'addWhere',
    value: function addWhere(clause, continuation) {
      if (_lodash2.default.isUndefined(clause)) throw Error('You must supply a clause to the addWhere method.');
      if (this.whereClauses.length >= 1) {
        if (continuation) clause.continuation = continuation;else throw Error('Supply AND or OR as a continuation after the first WHERE clause.');
      }
      if (clause.op && clause.args) clause = utils.transformClauseFromOldSyntax(clause);
      utils.checkClause(clause);
      clause.continuation = continuation;
      this.whereClauses.push(clause);
      return this;
    }
  }, {
    key: 'addSubWhere',
    value: function addSubWhere(model, clause, continuation) {
      if (_lodash2.default.isUndefined(model) || _lodash2.default.isUndefined(clause)) throw Error('You must supply a model and clause to the addWhere method.');
      if (this.subWhereClauses.length >= 1) {
        if (continuation) clause.continuation = continuation;else throw Error('Supply AND or OR as a continuation after the first SUBWHERE clause.');
      }
      if (clause.op && clause.args) clause = utils.transformClauseFromOldSyntax(clause);
      utils.checkClause(clause);
      if (!this.subWhereClauses[model]) this.subWhereClauses[model] = [];
      this.subWhereClauses[model].push(clause);
      return this;
    }
  }, {
    key: 'embedList',
    value: function embedList(_embedList) {
      if (_lodash2.default.isUndefined(_embedList)) return this._embedList;
      this._embedList = _embedList;
      return this;
    }
  }, {
    key: 'addEmbedProperty',
    value: function addEmbedProperty(prop) {
      if (prop instanceof Array) {
        this._embedList = _lodash2.default.union(this._embedList, prop);
      } else {
        if (!_lodash2.default.contains(this._embedList, prop)) this._embedList.push(prop);
      }
      return this;
    }
  }, {
    key: 'addSelectProperty',
    value: function addSelectProperty(prop) {
      if (prop instanceof Array) {
        this._selectList = _lodash2.default.union(this._selectList, prop);
      } else {
        if (!_lodash2.default.contains(this._selectList, prop)) this._selectList.push(prop);
      }
      return this;
    }
  }, {
    key: 'selectList',
    value: function selectList(_selectList) {
      if (_lodash2.default.isUndefined(_selectList)) return this._selectList;
      this._selectList = _selectList;
      return this;
    }
  }, {
    key: 'orderBy',
    value: function orderBy(_orderBy) {
      if (_lodash2.default.isUndefined(_orderBy)) return this._orderBy;
      if (!_orderBy.fields || !_orderBy.direction) {
        throw Error('Order by should have field/fields and direction.');
      }
      var fields = void 0;
      this._orderBy = _orderBy;
      return this;
    }
  }, {
    key: 'skip',
    value: function skip(_skip) {
      if (_lodash2.default.isUndefined(_skip)) return this._skip;
      this._skip = _skip;
      return this;
    }
  }, {
    key: 'limit',
    value: function limit(_limit) {
      if (_lodash2.default.isUndefined(_limit)) return this._limit;
      this._limit = _limit;
      return this;
    }
  }, {
    key: 'isCount',
    value: function isCount(_isCount) {
      if (_lodash2.default.isUndefined(_isCount)) return this._isCount;
      this._isCount = _isCount;
      return this;
    }
  }]);

  return Neo4jQueryBuilder;
}();

//INITIAL PHASE


var initialPhase = function initialPhase() {
  var query = this.sg.getMatch(this.model().label, names.setGetNextMapName());
  return [query];
};

//FILTER PHASE
var filterPhase = function filterPhase() {
  var _this = this;

  var query = [];
  if (this._id) {
    query.push(sg.getWhereId(names.getCurrentMapName(), this._id));
  } else if (this._idArray) {
    query.push('WHERE id(' + names.getCurrentMapName() + ') IN [' + this._idArray + '])');
  } else {
    (function () {
      var wheres = [];
      _lodash2.default.each(_this.whereClauses, function (clause) {
        wheres.push(sg.getWhere(names.getCurrentMapName(), Constants.Operators[clause.operator], clause.field, clause.value, clause.continuation) + '');
      });
      if (!_lodash2.default.isEmpty(wheres)) {
        wheres = wheres.join(' ');
        query.push(wheres);
      }
    })();
  }
  return query;
};

//EMBED PHASE
var embedPhase = function embedPhase() {
  var query = [];

  var embedToQuery = function embedToQuery(v) {
    var _this2 = this;

    var definition = this.model().definition[v];

    var query = [];

    var selectList = [];
    if (_lodash2.default.contains(this.embedList(), v)) {
      selectList = selectList.concat(definition.type.to.getPrimitiveFields());
    } else {
      selectList.push('id');
    }

    if (this.subWhereClauses[v]) {
      (function () {
        query.push(_this2.sg.getRelationMatch('m_0', names.setGetNextRelationMapName(), _this2.model().label, definition));
        var subWheres = [];
        _lodash2.default.each(_this2.subWhereClauses[v], function (clause) {
          subWheres.push(this.sg.getWhere(names.getCurrentRelationMapName(), Constants.Operators[clause.operator], clause.field, clause.value, clause.continuation));
        }, _this2);
        query.push(subWheres.join(' '));
      })();
    } else {
      query.push(this.sg.getOptionalRelationMatch('m_0', names.setGetNextRelationMapName(), this.model().label, definition));
    }

    if (definition.type instanceof _FieldTypes2.default.OneRelation) {
      var relationNames = _lodash2.default.map(this.sg.relationMap, function (v, k) {
        return v;
      });
      query.push('WITH ' + _lodash2.default.union(names.getMapNames(), relationNames).join(',') + ',{' + this.sg.getMap(names.getCurrentRelationMapName(), definition.type.to.getPrimitiveFields(), selectList, false) + '} AS ' + names.setGetNextRelationMapName() + ' ');
      this.sg.relationMap[v] = names.getCurrentRelationMapName();
    }
    if (definition.type instanceof _FieldTypes2.default.ManyRelation) {
      var _relationNames = _lodash2.default.map(this.sg.relationMap, function (v, k) {
        return v;
      });
      query.push('WITH ' + _lodash2.default.union(names.getMapNames(), _relationNames).join(',') + ',COLLECT(DISTINCT ' + '{' + this.sg.getMap(names.getCurrentRelationMapName(), definition.type.to.getPrimitiveFields(), selectList, false) + '}' + ') AS ' + names.setGetNextRelationMapName() + ' ');
      this.sg.relationMap[v] = names.getCurrentRelationMapName();
    }
    return query.join('\n');
  };

  _lodash2.default.each(this.model().getRelationFields(), function (field) {
    query.push(embedToQuery.call(this, field));
  }, this);

  return query;
};

//RETURN PHASE
var returnPhase = function returnPhase() {
  var query = this.sg.getReturn(names.getCurrentMapName(), this.model().getPrimitiveFields(), this.selectList(), null, names.setGetNextMapName());
  return [query];
};

//ORDER PHASE
var orderPhase = function orderPhase() {
  var query = [];
  if (this._orderBy) query.push(this.sg.getOrderBy(names.getCurrentMapName(), this._orderBy.fields, this._orderBy.direction));
  return query;
};

//RANGE PHASE
var rangePhase = function rangePhase() {
  var query = [];
  var str = this.sg.getRange(this.skip(), this.limit());
  if (str) query.push(str);
  return query;
};

var NQB = Neo4jQueryBuilder.prototype;

//Default phases
NQB.phases = {
  initialPhase: initialPhase,
  filterPhase: filterPhase,
  embedPhase: embedPhase,
  returnPhase: returnPhase,
  orderPhase: orderPhase,
  rangePhase: rangePhase
};

//Replace a phase with another one
NQB.replacePhase = function (phaseName, phaseFunction) {
  if (this.phases.hasOwnProperty(phaseName)) {
    this.phases[phaseName] = phaseFunction;
  }
};

//Get query from QueryBuilder
NQB.getQuery = function () {
  names.reset();
  var query = [];
  if (!this.model()) throw Error('QueryBuilder needs a Model to construct query!');
  //in case of count
  if (this._isCount) {
    query.push(this.phases.initialPhase.call(this));
    query.push(this.phases.filterPhase.call(this));
    query.push(sg.getCount(names.getCurrentMapName()));
    return query.join(' ');
  }
  for (var phase in this.phases) {
    var currentQueryPart = this.phases[phase].call(this);
    if (!_lodash2.default.isEmpty(currentQueryPart)) {
      query = _lodash2.default.union(query, currentQueryPart);
    }
  }
  query = query.join(' \n');
  return query;
};

exports.default = Neo4jQueryBuilder;