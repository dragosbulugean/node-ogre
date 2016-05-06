/**
 * Created by Dragos on 6/4/14.
 */

import Model from './Model'
import FieldTypes from './FieldTypes'
import Constants from './Constants'
import * as utils from './Utils'
import _ from 'lodash'
import Promise from 'bluebird'
import seraph from 'seraph'

//Framework bootstrapper that loads models,
//and makes sure the definitions are right.
class Bootstrapper {

	constructor(models) {
		if(!_.isUndefined(models)) {
			utils.checkModels(models)
			this._models = models
		}
	}

	models(models) {
		if(_.isUndefined(models)) return this._models
		utils.checkModels(models)
		this._models = models
		return this
	}

	debugMode(flag) {
		if(_.isUndefined(flag)) return this.__debugMode
		this.__debugMode = flag
		return this
	}

	db(db) {
		if(_.isUndefined(db)) throw Error('Please provide db.')
		this.seraph(seraph(db))
		return this
	}

	seraph(seraph) {
		if(_.isUndefined(seraph)) return this.__seraph
		this.__seraph = Promise.promisifyAll(seraph)
		return this
	}

	initialize() {
		//Verify relations
		let seraph = this.seraph()
		_.each(this.models(), (model) => {
			//set seraph
			model.setSeraph(seraph)
			_.each(model.definition, (definition) => {
				if(!definition.type) {
					throw Error(`${model.label} must define types for all properties!`)
				} else {
					if(definition.type instanceof FieldTypes.OneRelation ||
						definition.type instanceof FieldTypes.ManyRelation) {
						let modelExists = false
						this._models.forEach((submodel) => {
							if(definition.type.to === submodel ||
								definition.type.to === submodel.label ) {
								modelExists = true
								definition.type.to = submodel
							}
						})
						if(!modelExists)
							throw Error(`${definition.type.to} does not exist ` +
													`and cannot be tied to ${model.label}!`)
					}
				}
			}, this)
		}, this)
		if(this.debugMode()) {
			console.log("OGRE is alive.")
		}
	}
}

export default Bootstrapper
