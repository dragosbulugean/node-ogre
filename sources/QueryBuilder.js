/**
 * Created by Dragos on 5/19/14.
 */
import MapNameUtility from './MapNameUtility'
import _ from 'lodash'
import FieldTypes from './FieldTypes'
import * as Constants from './Constants'
import Model from './Model'
import * as utils from './Utils'
import StringGenerator from './StringGenerator'

let names = new MapNameUtility()
let sg = new StringGenerator()

//Constructor
class Neo4jQueryBuilder {

  constructor() {
    this._embedList = []
  	this._selectList = []
  	this._orderBy = {fields:['id'], direction: 'ASC'} //default orderby
  	this.whereClauses = []
  	this.subWhereClauses = {}
  	this.names = new MapNameUtility()
  	this.sg = new StringGenerator()
  }

  model(model) {
  	if(_.isUndefined(model)) return this._model
      this._model = model
  	return this
  }

  id(id) {
  	if(_.isUndefined(id)) return this._id
  	if(this._idArray)
      throw Error('QueryBuilder needs to have either id or idArray.')
  	this._id = id
  	return this
  }

  idArray(idArray) {
  	if(_.isUndefined(idArray)) return this._idArray
  	if(this._id)
      throw Error('QueryBuilder needs to have either id or idArray.')
  	this._idArray = idArray
  	return this
  }

  addWhere(clause, continuation) {
  	if(_.isUndefined(clause))
  		throw Error('You must supply a clause to the addWhere method.')
  	if(this.whereClauses.length >= 1) {
  		if(continuation)
        clause.continuation = continuation
  		else
        throw Error('Supply AND or OR as a continuation after the first WHERE clause.')
  	}
  	if(clause.op && clause.args) clause = utils.transformClauseFromOldSyntax(clause)
  	utils.checkClause(clause)
  	clause.continuation = continuation
  	this.whereClauses.push(clause)
      return this
  }

  addSubWhere(model, clause, continuation) {
  	if(_.isUndefined(model) || _.isUndefined(clause))
  		throw Error('You must supply a model and clause to the addWhere method.')
  	if(this.subWhereClauses.length >= 1) {
  		if(continuation)
        clause.continuation = continuation
  		else
        throw Error('Supply AND or OR as a continuation after the first SUBWHERE clause.')
  	}
  	if(clause.op && clause.args) clause = utils.transformClauseFromOldSyntax(clause)
  	utils.checkClause(clause)
  	if(!this.subWhereClauses[model])
  		this.subWhereClauses[model] = []
  	this.subWhereClauses[model].push(clause)
  	return this
  }

  embedList(embedList) {
  	if(_.isUndefined(embedList)) return this._embedList
  	this._embedList = embedList
  	return this
  }

  addEmbedProperty(prop) {
      if(prop instanceof Array) {
          this._embedList = _.union(this._embedList, prop)
      } else {
  		if(!_.contains(this._embedList,prop)) this._embedList.push(prop)
      }
  	return this
  }

  addSelectProperty(prop) {
  	if(prop instanceof Array) {
  		this._selectList = _.union(this._selectList, prop)
  	} else {
  		if(!_.contains(this._selectList,prop)) this._selectList.push(prop)
  	}
  	return this
  }

  selectList(selectList) {
  	if(_.isUndefined(selectList)) return this._selectList
  	this._selectList = selectList
  	return this
  }

  orderBy(orderBy) {
  	if(_.isUndefined(orderBy)) return this._orderBy
  	if(!orderBy.fields || !orderBy.direction) {
  		throw Error('Order by should have field/fields and direction.')
  	}
  	let fields
  	this._orderBy = orderBy
  	return this
  }

  skip(skip) {
  	if(_.isUndefined(skip)) return this._skip
      this._skip = skip
      return this
  }

  limit(limit) {
  	if(_.isUndefined(limit)) return this._limit
      this._limit = limit
      return this
  }

  isCount(isCount) {
  	if(_.isUndefined(isCount)) return this._isCount
  	this._isCount = isCount
  	return this
  }

}

//INITIAL PHASE
let initialPhase = function() {
	let query = this.sg.getMatch(this.model().label, names.setGetNextMapName())
	return [query]
}

//FILTER PHASE
let filterPhase = function() {
	let query = []
	if(this._id) {
		query.push(sg.getWhereId(names.getCurrentMapName(), this._id))
	} else if(this._idArray) {
		query.push(`WHERE id(${names.getCurrentMapName()}) IN [${this._idArray}])`)
	} else {
		let wheres = []
		_.each(this.whereClauses, function(clause){
			wheres.push(
        sg.getWhere(names.getCurrentMapName(),
        Constants.Operators[clause.operator],
        clause.field, clause.value,
        clause.continuation) + '')
		})
		if(!_.isEmpty(wheres)) {
			wheres = wheres.join(' ')
			query.push(wheres)
		}
	}
	return query
}

//EMBED PHASE
let embedPhase = function() {
	let query = []

	let embedToQuery = function(v) {
		let definition = this.model().definition[v]

		let query = []

		let selectList = []
		if(_.contains(this.embedList(), v)) {
			selectList = selectList.concat(definition.type.to.getPrimitiveFields())
		} else {
			selectList.push('id')
		}

		if(this.subWhereClauses[v]) {
			query.push(
        this.sg.getRelationMatch('m_0', names.setGetNextRelationMapName(),
                                 this.model().label, definition))
			let subWheres = []
			_.each(this.subWhereClauses[v], function(clause){
				subWheres.push(
          this.sg.getWhere(names.getCurrentRelationMapName(),
                           Constants.Operators[clause.operator],
                           clause.field, clause.value, clause.continuation))
			}, this)
			query.push(subWheres.join(' '))
		} else {
			query.push(
        this.sg.getOptionalRelationMatch('m_0', names.setGetNextRelationMapName(),
                                         this.model().label, definition))
		}

		if(definition.type instanceof FieldTypes.OneRelation) {
			let relationNames = _.map(this.sg.relationMap, function(v,k){
				return v
			})
			query.push('WITH ' + _.union(names.getMapNames(), relationNames).join(',') +
          ',{' + this.sg.getMap(names.getCurrentRelationMapName(),
          definition.type.to.getPrimitiveFields(), selectList, false) + '} AS ' +
					names.setGetNextRelationMapName() + ' ')
			this.sg.relationMap[v] = names.getCurrentRelationMapName()
		}
		if(definition.type instanceof FieldTypes.ManyRelation) {
			let relationNames = _.map(this.sg.relationMap, function(v,k){
				return v
			})
			query.push('WITH ' + _.union(names.getMapNames(), relationNames).join(',') +
                 ',COLLECT(DISTINCT ' + '{' +
                  this.sg.getMap(names.getCurrentRelationMapName(),
                                 definition.type.to.getPrimitiveFields(),
                                 selectList, false) +
                 '}'
				   + ') AS ' + names.setGetNextRelationMapName() + ' ')
			this.sg.relationMap[v] = names.getCurrentRelationMapName()
		}
		return query.join('\n')
	}

	_.each(this.model().getRelationFields(), function(field){
		query.push(embedToQuery.call(this, field))
	}, this)

	return query
}

//RETURN PHASE
let returnPhase = function() {
	let query = this.sg.getReturn(names.getCurrentMapName(),
                                this.model().getPrimitiveFields(),
											          this.selectList(), null, names.setGetNextMapName())
	return [query]
}

//ORDER PHASE
let orderPhase = function() {
	let query = []
	if(this._orderBy)
		query.push(this.sg.getOrderBy(names.getCurrentMapName(),
                                  this._orderBy.fields, this._orderBy.direction))
	return query
}

//RANGE PHASE
let rangePhase = function() {
	let query = []
	let str = this.sg.getRange(this.skip(), this.limit())
	if(str) query.push(str)
	return query
}

let NQB = Neo4jQueryBuilder.prototype

//Default phases
NQB.phases = {
	initialPhase:   initialPhase,
	filterPhase:    filterPhase,
	embedPhase:     embedPhase,
	returnPhase:    returnPhase,
	orderPhase:     orderPhase,
	rangePhase:     rangePhase
}

//Replace a phase with another one
NQB.replacePhase = function(phaseName, phaseFunction) {
	if(this.phases.hasOwnProperty(phaseName)) {
		this.phases[phaseName] = phaseFunction
	}
}

//Get query from QueryBuilder
NQB.getQuery = function() {
	names.reset()
    let query = []
    if(!this.model()) throw Error('QueryBuilder needs a Model to construct query!')
	//in case of count
	if (this._isCount) {
		query.push(this.phases.initialPhase.call(this))
		query.push(this.phases.filterPhase.call(this))
		query.push(sg.getCount(names.getCurrentMapName()))
		return query.join(' ')
	}
	for(let phase in this.phases) {
		let currentQueryPart = this.phases[phase].call(this)
		if(!_.isEmpty(currentQueryPart)) {
			query = _.union(query, currentQueryPart)
		}
	}
	query = query.join(' \n')
    return query
}

export default Neo4jQueryBuilder
