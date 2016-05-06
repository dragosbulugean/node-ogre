/**
 * Created by Dragos on 2/26/15.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import * as Serializer from '../../sources/Serializer'
import * as Models from '../setup/testModels'
import _ from 'lodash'

describe('Serializer', () => {
	describe('#serializeModel', () => {
		it('can serialize an ogre model', () => {
			let personData = {
				firstName: 'Johnny',
				lastName: 'Cash'
			}
			let person = Models.Person.instantiate(personData)
			let serializedModel = Serializer.serializeModel(person)
			let deserializedModel = JSON.parse(serializedModel)
			deserializedModel.firstName.should.eql(personData.firstName)
			deserializedModel.lastName.should.eql(personData.lastName)
		})
	})
	describe('#serializeModels', () => {
		it('can serialize an array of ogre models', () => {
			let people = []
			_.each(_.range(0,3), (i) => {
				let personData = {
					firstName: 'Johnny_'+i,
					lastName: 'Cash_'+i
				}
				let person = Models.Person.instantiate(personData)
				people.push(person)
			})
			let serializedModels = Serializer.serializeModels(people)
			let deserializedModels = JSON.parse(serializedModels)
			_.each(_.range(0,3), (i) => {
				deserializedModels[i].firstName.should.eql('Johnny_'+i)
				deserializedModels[i].lastName.should.eql('Cash_'+i)
			})
		})
	})
})