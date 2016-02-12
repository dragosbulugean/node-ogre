/**
 * Created by Dragos on 2/26/15.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var Serializer = require('../../compiled/Serializer')
var Models = require('../setup/testModels')
var _ = require('lodash')

describe('Serializer', function(){
	describe('#serializeModel', function(){
		it('can serialize an ogre model', function(){
			var personData = {
				firstName: 'Johnny',
				lastName: 'Cash'
			}
			var person = Models.Person.instantiate(personData)
			var serializedModel = Serializer.serializeModel(person)
			var deserializedModel = JSON.parse(serializedModel)
			deserializedModel.firstName.should.eql(personData.firstName)
			deserializedModel.lastName.should.eql(personData.lastName)
		})
	})
	describe('#serializeModels', function(){
		it('can serialize an array of ogre models', function(){
			var people = []
			_.each(_.range(0,3), function(i){
				var personData = {
					firstName: 'Johnny_'+i,
					lastName: 'Cash_'+i
				}
				var person = Models.Person.instantiate(personData)
				people.push(person)
			})
			var serializedModels = Serializer.serializeModels(people)
			var deserializedModels = JSON.parse(serializedModels)
			_.each(_.range(0,3), function(i){
				deserializedModels[i].firstName.should.eql('Johnny_'+i)
				deserializedModels[i].lastName.should.eql('Cash_'+i)
			})
		})
	})
})