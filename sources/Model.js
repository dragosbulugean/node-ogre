/**
 * Created by Dragos on 5/20/14
 */

import Constants from './Constants'
import FieldTypes from './FieldTypes'
import * as Finders from './Finders'
import * as PersistenceManager from './PersistenceManager'
import * as ValidationManager from './ValidationManager'
import Serializer from './Serializer'
import * as utils from './Utils'
import Promise from 'bluebird'
import _ from 'lodash'

class Model {

	constructor(label, definition) {

		//left here for legacy purposes
		this.label = label
		this.definition = definition

		this.meta = {
			label: label,
			definition: definition,
			primitiveFields: [],
			relationFields: [],
			oneRelationFields: [],
			manyRelationFields: []
		}

		// Separate relations into types
		for(let property in this.definition) {
			let definition = this.definition[property]
			if(definition.type instanceof FieldTypes.OneRelation) {
				this.meta.relationFields.push(property)
				this.meta.oneRelationFields.push(property)
			}
			else if(definition.type instanceof FieldTypes.ManyRelation) {
				this.meta.relationFields.push(property)
				this.meta.manyRelationFields.push(property)
			}
			else {
				this.meta.primitiveFields.push(property)
			}
		}

	}

	getLabel() {
		return this.meta.label
	}

	getDefinition() {
		return this.meta.definition
	}

	getRelationFields() {
		return this.meta.relationFields
	}

	getPrimitiveFields() {
		return this.meta.primitiveFields
	}

	getOneRelationFields() {
		return this.meta.oneRelationFields
	}

	getManyRelationFields() {
		return this.meta.manyRelationFields
	}

	getAllFields() {
		return _.union(this.primitiveFields, this.relationFields)
	}

	instantiateHelper() {
		let instance = new Model(this.label, this.definition)
		instance.meta = this.meta
		instance.data = {}

		//Getters and setters synthetisation
		let properties = {}
		for(let definition in instance.definition) {
			properties[definition] = {
				get: utils.wrapGet(instance, definition),
				set: utils.wrapSet(instance, definition),
				enumerable: true,
				configurable: true
			}
		}
		Object.defineProperties(instance, properties)


		for (let def in instance.definition) {
			let definition = instance.definition[def]
			if(definition.type instanceof FieldTypes.ManyRelation)
				instance.data[def] = []
		}
		return instance
	}

	populate(data) {
		for(let k in data) {
			let v = data[k]
			this.set(k, v)
		}
	}

	instantiate(data) {
		let instance = this.instantiateHelper(data)
		instance.populate(data)
		return instance
	}

	populateFromDatabaseData(data) {
		for (let key in data) {
			if (data.hasOwnProperty(key)) {
				let value = data[key]
				if(!_.isNull(value)) {
					if (this.definition.hasOwnProperty(key)) {

						if(this.definition[key].type === FieldTypes.Date) {
							this.set(key, new Date(value))
						}

						else if (this.definition[key].type === FieldTypes.JSON) {
							this.set(key, JSON.parse(value))
						}

						else if (this.definition[key].type === FieldTypes.Array) {
							this.set(key, value)
						}

						else if (this.definition[key].type instanceof FieldTypes.OneRelation) {
							if(_.keys(value).length === 1) {
								this[key] = value.id
							} else {
								if(value.id) {
									this[key] = this.definition[key].type.to.instantiateFromDatabaseData(value)
								} else {
									this[key] = null
								}
							}
						}

						else if (this.definition[key].type instanceof FieldTypes.ManyRelation){
							_.each(value, (item) => {
								if(_.keys(item).length === 1) {
									if(item.id) this[key].push(item.id)
								} else {
									if(item.id) this[key].push(
										this.definition[key].type.to.instantiateFromDatabaseData(item, true))
								}
							}, this)
						}

						else {
							this.set(key, value)
						}
					}
				} else {
					this.set(key, value)
				}
			}
		}
	}

	instantiateFromDatabaseData(data) {
		let instance = this.instantiateHelper(data)
		instance.populateFromDatabaseData(data)
		return instance
	}

	generateDataForPersistence() {
		let data = {}

		_.each(this.getPrimitiveFields(), (field) => {
			if(this[field] == null) {
				//Do nothing
			}
			else if(this.definition[field].type == FieldTypes.Date) {
				if(!(_.isUndefined(this[field]))) {
					if (this[field] instanceof Date) {
						data[field] = this[field].getTime()
					} else if (this[field]._isAMomentObject) {
						data[field] = this[field].toDate().getTime()
					}
				}
			}
			else if(this.definition[field].type == FieldTypes.JSON) {
				data[field] = JSON.stringify(this[field])
			}
			else {
				data[field] = this[field]
			}
		}, this)

		return data
	}

	//Low level Getters for data. Used inside properties
	get(property) {
		if(this.definition.hasOwnProperty(property)) {
			return this.data[property]
		}
		throw Error('No such property!')
	}

	//Low level Setters for data. Used inside properties
	set(property, value) {
		if(_.isUndefined(property) || _.isUndefined(value)) return this
		if(!this.data) {
			throw Error('Model has not been instantiated, cannot set properties.')
		}

		if(_.includes(this.getPrimitiveFields(), property)) {
			if(_.isUndefined(ValidationManager.validateType(this.definition[property].type, value))){
				this.data[property] = value
				this.isSyncronised = false
			} else {
				throw Error(`Value ${value} of property ${property}` +
					 					`does not match the type declared in ${this.label}!`)
			}
		}
		else if(_.includes(this.getRelationFields(), property)) {
			this.data[property] = value
			this.isSyncronised = false
		}
		else {
			throw Error(`Property ${property} not found in ${this.label}!`)
		}
		return this
	}

	setSeraph(seraph) {
		this.meta.seraph = seraph
		return this
	}

	seraph() {
		return this.meta.seraph
	}

	findById(id, selectList, embedList) {
		return Finders.findById(this, id, selectList, embedList)
	}

	findByIdArray(idArray, selectList, embedList) {
		return Finders.findByIdArray(this, idArray, selectList, embedList)
	}

	findAll(selectList, embedList) {
		return Finders.findAll(this, selectList, embedList)
	}

	findByExample(example, selectList, embedList) {
		return Finders.findByExample(this, example, selectList, embedList)
	}

	findByQueryBuilder(queryBuilder) {
		return Finders.findByQueryBuilder(this, queryBuilder)
	}

	findByQueryString(queryString) {
		return Finders.findByQueryString(this, queryString)
	}

	findRandom(number, selectList, embedList) {
		return Finders.findRandom(this, number, selectList, embedList)
	}

	count() {
		return Finders.count(this)
	}

	save(relationed) {
		return PersistenceManager.save(this, relationed)
	}

	remove() {
		return PersistenceManager.remove(this, false)
	}

	hardRemove() {
		return PersistenceManager.remove(this, true)
	}

	validate() {
		return ValidationManager.validateModel(this)
	}

	serialize() {
		return Serializer.serializeModel(this)
	}

}

export default Model
