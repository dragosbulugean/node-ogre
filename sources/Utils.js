/**
 * Created by Dragos on 7/8/14
 */

import Promise from 'bluebird'
import _ from 'lodash'
import * as Constants from './Constants'
import Model from './Model'

//Get & Set wrappers to fix scoping issues caused by defining properties
let wrapSet = (instance, definition) => {
	return (newValue) => {
		instance.set(definition, newValue)
	}
}

let wrapGet = (instance, definition) => {
	return () => {
		return instance.get(definition)
	}
}

//Helper function to call when ending one queries.
let executeSingle = (model, query) => {
	let deferred = Promise.defer()
	model.seraph().queryAsync(query, {})
		.then((result) => {
			if(!result || _.isEmpty(result)) {
				return deferred.reject(Error('Node not found!'))
			}
			let modelInstance = model.instantiateFromDatabaseData(result[0], true)
			modelInstance.isSyncronised = true
			return deferred.resolve(modelInstance)
		})
		.catch((err) => {
			return deferred.reject(`Query: ${query} ${err}`)
		})
	return deferred.promise
}

//Helper function to call when ending many queries.
let executeMany = (model, query) => {
	let deferred = Promise.defer()
	model.seraph().queryAsync(query, {})
		.then((result) => {
			let models = []
			result.forEach((data) => {
				//TODO solve this in neo4j-cypher
				if(data.metadata) {
					let id = data.metadata.id
					data = data.data
					data.id = id
				}
				let modelInstance = model.instantiateFromDatabaseData(data)
				modelInstance.isSyncronised = true
				models.push(modelInstance)
			})
			return deferred.resolve(models)
		})
		.catch((err) => {
			return deferred.reject(`Query: ${query} ${err}`)
		})

	return deferred.promise
}

//Verify if clause has correct fields
let checkClause = (clause) => {
	if(_.isUndefined(clause.operator))
		throw Error('You must supply a clause to the addWhere method.')
	let isOperatorSupported = false
	_.each(Constants.Operators, (v,k) => {
		if(k === clause.operator) isOperatorSupported = true
	})
	if(!isOperatorSupported)
		throw Error(`${clause.operator} is not a supported operator` +
										`Supported operatos: ${Constants.Operators}`)
	if(_.isUndefined(clause.field))
		throw Error('You must supply a field on the clause.')
	if(_.isUndefined(clause.value))
		throw Error('You must supply a value on the clause.')
}

//Make clauses work with RQL style syntax
let transformClauseFromOldSyntax = (clause) => {
	return {
		operator: clause.op,
		field: clause.args[0],
		value: clause.args[1]
	}
}

let checkModels = (models) => {
	if(_.isArray(models)) {
		_.each(models, (model) => {
			if(!(model.label)) {
				throw Error('The model array should only contain Model instances.')
			}
		})
	} else throw Error('Please supply an array of models to this method.')
}

export {
	wrapSet,
	wrapGet,
	executeSingle,
	executeMany,
	checkClause,
	transformClauseFromOldSyntax,
 	checkModels
}
