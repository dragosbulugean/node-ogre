/**
 * Created by Dragos on 6/30/14.
 */
import _ from 'lodash'
import FieldTypes from './FieldTypes'

let serializeModel = (model) => {
	if(!model) return
	if(model.data) model = model.data
	let json = JSON.stringify(model)
	return json
}

let serializeModels = (models) => {
	if(models.length == 0) return '[]'
	let json = []
	for(let model in models) {
		model = models[model]
		json.push(serializeModel(model))
	}
	let serialized = '[' + json.join(',') + ']'
	return serialized
}

let getData = (modelOrModels) => {
	if(_.isArray(modelOrModels)) {
		return _.map(modelOrModels, function(model){
			return getModelData(model)
		})
	} else {
		return getModelData(modelOrModels)
	}
}

let getModelData = (model) => {
	let data = {}
	_.each(_.keys(model.data), function(key){
		if(model.definition[key].type instanceof FieldTypes.OneRelation) {
			if(model[key]===null) data[key] = null
			else data[key] = model[key].data || model[key]
		} else if(model.definition[key].type instanceof FieldTypes.ManyRelation) {
			let arrayData = []
			_.each(model[key], function(m){
				arrayData.push(m.data||m)
			})
			data[key] = arrayData
		} else {
			data[key] = model[key]
		}
	})
	return data
}

export {
	serializeModel,
	serializeModels,
	getData
}
