/**
 * Created by Dragos on 6/5/14.
 */

import Model from './Model'
import * as Constants from './Constants'
import MapNameUtility from './MapNameUtility'
import _ from 'lodash'

class StringGenerator {

	constructor() {
		this.names = new MapNameUtility()
		this.relationMap = {}
	}

	getDirection(direction, relationType, variable, inverse) {
		if(!direction || !relationType)
			throw Error('Please supply direction and relationType to the function.')
		if(!variable) variable = ''
		let inDirection = false
		let outDirection = false
		if(direction.indexOf(Constants.Directions.In) > -1)
			inDirection = true
		if(direction.indexOf(Constants.Directions.Out) > -1)
			outDirection = true
		let str = (inDirection==true?Constants.Directions.In:'') +
			         `-[${variable}:${relationType}]-` +
		          (outDirection==true?Constants.Directions.Out:'')
		return str
	}

	getMap(mapName, propertiesList, selectList, isIdSupplied) {
		let query = []
		propertiesList.forEach((v,k) => {
			if(v==='id') {
				if(isIdSupplied) {
					query.push(`id:${mapName}.id`)
					return
				}
				query.push(`id:id(${mapName})`)
				return
			}
			if(selectList && selectList.length !== 0) {
				if(selectList.indexOf(v) !== -1){
					query.push(`${v}:${mapName}.${v}`)
				}
			} else {
				query.push(`${v}:${mapName}.${v}`)
			}
		}, this)
		return query.join(', ')
	}

	getWith(usedMapNames, mapName, nextMapName, propertiesList, selectList) {
		let query = `WITH ${usedMapNames}{` +
								this.getMap(mapName, propertiesList, selectList, false) +
								`} AS ${nextMapName} `
		return query
	}

	getWithFromRelation(usedMapNames, relationMapName, nextRelationMapName,
											propertiesList, selectList) {
		let query = `WITH ${usedMapNames}{` +
								this.getMap(relationMapName, propertiesList, selectList, false) +
								`} AS ${nextRelationMapName} `
		return query
	}

	getEmbeddedWith(usedMapNames, lastMapName, primitivesList,
									relationPropertiesList, selectList, relationMap) {
		let query = `WITH ${usedMapNames} {` +
								this.getMap(lastMapName, primitivesList, selectList, true) + ' '
		let partialQuery = []
		for(let relation in relationMap) {
			partialQuery.push(relation + ':' + relationMap[relation])
		}
		return query + partialQuery.join(', ')
	}

	getMatch(modelName, mapName) {
		if(modelName)
			return `MATCH (${mapName}:${modelName}) `
		return `MATCH (${modelName}) `
	}

	getWhereId(mapName, id) {
		return `WHERE id(${mapName})=${id} `
	}

	getReturn(mapName, propList, selectList, isIdSupplied, nextMapName) {
		let returnQuery = 'RETURN DISTINCT {' +
											this.getMap(mapName, propList, selectList, isIdSupplied)
		for(let relation in this.relationMap) {
			returnQuery += ', ' + relation + ':' + this.relationMap[relation]
		}
		returnQuery += '} as ' + nextMapName
		return returnQuery
	}

	getCount(mapName) {
		if(!mapName) throw Error('Please supply mapName to function.')
		return `RETURN count(${mapName})`
	}

	getRange(skip, limit) {
	    let query = []
	    if (skip)
	        query.push(`SKIP ${skip}`)
	    if (limit)
	        query.push(`LIMIT ${limit}`)
	    return query.join(' ')
	}

	getRevertedNodesFromMap(currentMapName, lastMapName, label) {
		let query = this.getMatch(label, currentMapName) +
								this.getWhereId(currentMapName, lastMapName) + '.id'
		return query
	}

	getRelationMatch(currentMapName, currentRelationMapName, label, def) {
		let query = this.getMatch(label, currentMapName) +
					this.getDirection(def.type.direction, def.type.relationType) +
					'(' + currentRelationMapName + ':' + def.type.to.label + ') '
		return query
	}

	getOptionalRelationMatch(currentMapName, currentRelationMapName, label, definition) {
		let query = 'OPTIONAL ' +
			this.getRelationMatch(currentMapName, currentRelationMapName, label, definition)
		return query
	}

	getCreate(modelLabel, modellet, modelDataVar) {
		let query = `CREATE (${modellet}:${modelLabel} {${modelDataVar}}) `
		return query
	}

	getOrderBy(mapName, fields, direction) {
		if(!mapName || !fields || !direction)
			throw Error('Supply mapName|field|direction to this function.')
		if(direction!='ASC' && direction!='DESC')
			throw Error('Supply direction with value ASC|DESC.')
		let efs = []
		_.each(fields, (field) => {
			efs.push(`${mapName}.${field}`)
		})
		let query = `ORDER BY ${efs.join(', ')} ${direction}`
		return query
	}

	getWhere(mapName, operator, field, value, continuation) {
		let initial
		operator = operator.toUpperCase()
		if(!continuation)
			initial = 'WHERE '
		else
			initial = continuation.trim() + ' '

		if(operator == Constants.Operators.in)
			value = JSON.stringify(value)
		else if(!_.isNumber(value) && !_.isBoolean(value))
			value = `"${value}"`

		if(field == "id")
			return `${initial}id(${mapName}) ${operator} ${value}`

		return  `${initial}${mapName}.${field} ${operator} ${value}`
	}

}

export default StringGenerator
