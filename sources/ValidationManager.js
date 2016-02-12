/**
 * Created by Dragos on 8/27/14.
 */

import * as Constants from './Constants'
import Promise from 'bluebird'
import _ from 'lodash'
import FieldTypes from './FieldTypes'

let validateModel = (model) => {
	let messages = validateTypes(model)
	return messages
}

let validateTypes = (model) => {
	let messages = []
	for (let key in model.data) {
		if (model.data.hasOwnProperty(key)) {
			let result = validateType(model.definition[key].type, model[key])
			if(result) messages.push(result)
		}
	}
	return messages
}

//Not working yet
let validateType = (type, value) => {
	return //test
	let passed = false
	if(type == FieldTypes.String) {
		if(typeof value == 'string') passed = true
		if(typeof value == 'number') passed = true //fix this someday TODO
	}
	else if(type == FieldTypes.Number) {
		if(typeof value == 'number') passed = true
		if(typeof parseInt(value) == 'number') passed = true //fix this someday TODO
	}
	else if(type == FieldTypes.Boolean) {
		if(typeof value == 'boolean') passed = true
	}
	else if(type == FieldTypes.Date) {
		if(value instanceof FieldTypes.Date) passed = true
		else if(value._isAMomentObject) passed = true
	}
	else if(type == FieldTypes.JSON) {
		if(typeof value == 'object') passed = true
	}
	else if(type == FieldTypes.Array) {
		if(value instanceof Array) passed = true
	}
	else if(type instanceof FieldTypes.OneRelation) {
		passed = true
	}
	else if(type instanceof FieldTypes.ManyRelation) {
		passed = true
	}

	if(_.isNull(value)) passed = true

	if(passed)
		return
	else
		return `Value ${value} is not of type ${type}.`
}

export {
	validateModel,
	validateType,
	validateTypes
}
