/**
 * Created by Dragos on 8/15/14.
 */

import * as utils from './Utils'
import Promise from 'bluebird'
import Chance from 'chance'
import _ from 'lodash'
import QueryBuilder from './QueryBuilder'

let executeSingle = utils.executeSingle
let executeMany = utils.executeMany
let chance = new Chance()

let findById = (model, id, selectList, embedList) => {
	let queryBuilder = new QueryBuilder()
	if(!isNaN(id)) id = parseInt(id)
	queryBuilder.model(model).id(id)
	if(selectList) queryBuilder.selectList(selectList)
	if(embedList) queryBuilder.embedList(embedList)
	let query = queryBuilder.getQuery()
	return executeSingle(model, query)
}

let findByIdArray = (model, idArray, selectList, embedList) => {
	let queryBuilder = new QueryBuilder()
	queryBuilder.model(model).idArray(idArray)
	if(selectList) queryBuilder.selectList(selectList)
	if(embedList) queryBuilder.embedList(embedList)
	let query = queryBuilder.getQuery()
	return executeMany(model, query)
}

let findAll = (model, selectList, embedList) => {
	let queryBuilder = new QueryBuilder()
	queryBuilder.model(model)
	if(selectList) queryBuilder.selectList(selectList)
	if(embedList) queryBuilder.embedList(embedList)
	let query = queryBuilder.getQuery()
	return executeMany(model, query)
}

let findByExample = (model, example, selectList, embedList) => {
	let queryBuilder = new QueryBuilder()
	queryBuilder.model(model)
	if(selectList) queryBuilder.selectList(selectList)
	if(embedList) queryBuilder.embedList(embedList)
	Object.keys(example).forEach(function(key){
		let clause = {
			operator: 'eq',
			field: key,
			value: example[key]
		}
		queryBuilder.addWhere(clause)
	})
	let query = queryBuilder.getQuery()
	return executeMany(model, query)
}

let findByQueryBuilder = (model, queryBuilder) => {
	let query = queryBuilder.model(model).getQuery()
	return executeMany(model, query)
}

let findByQueryString = (model, query) => {
	return executeMany(model, query)
}

let count = (model) => {
	let deferred = Promise.defer()
	let queryBuilder = new QueryBuilder().model(model).isCount(true)
	model.seraph().query(queryBuilder.getQuery(), {}, function(err, count){
		if (err) {
			return deferred.reject(err)
		}
		return deferred.resolve(count)
	})
	return deferred.promise
}

let findRandom = (model, number, selectList, embedList) => {
	let deferred = Promise.defer()
	if(_.isUndefined(number) || number == 0)
		return deferred.reject('Please supply number of records you want to get back. >0')
	let countPromise = count(model)
	countPromise
		.then(function(count){
			if(count<1)
				return deferred.reject(`There are no models of type: ${model.label} in the db.`)
			let random = chance.integer({min: 0, max: count-number})
			let queryBuilder = new QueryBuilder().limit(number).skip(random)
			if(selectList) queryBuilder.selectList(selectList)
			if(embedList) queryBuilder.embedList(embedList)
			model.findByQueryBuilder(queryBuilder)
				.then(function(models){
					return deferred.resolve(models)
				})
				.catch(function(err){
					return deferred.reject(err)
				})
		})
		.catch(function(err){
			return deferred.reject(err)
		})
	return deferred.promise
}

export {
	findById,
	findByIdArray,
	findAll,
	findByExample,
	findByQueryBuilder,
	findByQueryString,
	count,
	findRandom
}
