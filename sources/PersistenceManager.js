/**
 * Created by Dragos on 8/19/14.
 */

import Promise from 'bluebird'
import _ from 'lodash'
import Constants from './Constants'
import FieldTypes from './FieldTypes'
import StringGenerator from './StringGenerator'
let sg = new StringGenerator()
import Model from './Model'

let txn_save_one = (txn, model) => {
	let data = model.generateDataForPersistence()
	let m1 = txn.save(data, (err, node) => {
		if(!_.isUndefined(node)) {
			model.id = node.id
		}
	})
	if(!_.isNumber(model.id)) {
		m1 = txn.label(m1, model.label)
	}
	return m1
}

let txn_save_relation = (txn, id1, id2, relationType) => {
	if(!(txn && id1 && id2 && relationType)) {
		throw Error('Supply txn id1 id2 and relationtype to txn_save_relation')
	}
	if(!_.isNumber(id1)|| !_.isNumber(id2)|| !_.isString(relationType)) {
		throw Error('Wrong type for id1, id2 or relationType')
	}
	txn.relate(id1, relationType, id2)
	return txn
}

let txn_delete_relation = (txn, model1Id, model2Type, relationType) => {
	if(!(txn && model1Id && model2Type &&relationType)) {
		throw Error('Supply txn model1Id, model2Type and relationtype.')
	}
	let deleteRelationQuery =
		`START n=node(${model1Id}) ` +
	  `MATCH (n)-[rel:${relationType}]-(r:${model2Type}) ` +
    `DELETE rel`
	txn.query(deleteRelationQuery)
	return txn
}

let save = (model, relationed) => {
	let deferred = Promise.defer()

	if(relationed) relationed = _.intersection(relationed, model.getRelationFields())
	else relationed = model.getRelationFields()

	if(!model.data) {
		return deferred.reject(model.getNotInstantiatedError())
	}

	let delete_relations_batch = model.seraph().batch()
	//delete existing relations if not new
	if(model.id) {
		relationed.forEach((r) => {
			let model1Id = model.id
			let model2Label = model.definition[r].type.to.label
			let relationType = model.definition[r].type.relationType
			txn_delete_relation(delete_relations_batch, model1Id, model2Label, relationType)
		})
	}

	delete_relations_batch.commit((err, results) => {
		if (err) {
			return deferred.reject(err)
		}

		let save_models_batch = model.seraph().batch()
		let txn_model1 = txn_save_one(save_models_batch, model)

		_.each(relationed, (field) => {
			if(model[field]) {
				if(model.definition[field].type instanceof FieldTypes.OneRelation) {
					if(!_.isNumber(model[field])) txn_save_one(save_models_batch, model[field])
				} else if (model.definition[field].type instanceof FieldTypes.ManyRelation) {
					model[field].forEach((m) => {
						if(!_.isNumber(m)) txn_save_one(save_models_batch, m)
					})
				}
			}
		})

		save_models_batch.commit((err, results) => {
			if (err) {
				return deferred.reject(err)
			}

			let save_relations_batch = model.seraph().batch()

			_.each(relationed, (field) => {
				if(model[field]) {
					if(model.definition[field].type instanceof FieldTypes.OneRelation) {
						let relationType = model.definition[field].type.relationType
						let id2 = model[field].id || model[field]
						txn_save_relation(save_relations_batch, model.id, id2, relationType)
					} else if (model.definition[field].type instanceof FieldTypes.ManyRelation) {
						model[field].forEach((m) => {
							let relationType = model.definition[field].type.relationType
							let ids = model[field].map((item) => {
								return item.id || item
							})

							ids.forEach((item) => {
								txn_save_relation(save_relations_batch, model.id, item, relationType)
							})

						})
					}
				}
			})

			save_relations_batch.commit((err, results) => {
				if(err) {
					return deferred.reject(err)
				}
				return deferred.resolve(model)
			})
		})
	})

	return deferred.promise
}

let remove = (model, hard) => {

	let deferred = Promise.defer()

	if(_.isUndefined(model.id)) {
		process.nextTick(() => {
			return deferred.reject('Models need to be saved before deletion.')
		})
	}

	if(hard) {
		model.seraph().delete(model.id, true, (err, node) => {
			model.isSyncronised = true
			return deferred.resolve(model)
		})
	} else {
		model.seraph().label(model.id, [`_${model.label}`], true, (err, node) => {
			model.isSyncronised = true
			return deferred.resolve(model)
		})
	}

	return deferred.promise
}

export {
	save,
	remove
}
