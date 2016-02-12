/**
 * Created by Dragos on 7/11/14.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var Model = require("../../compiled/Model").default

describe('Model', function() {
	var definition = {
		id: {
			type: Number
		},
		firstName: {
			type: String
		},
		lastName: {
			type: String
		}
	}
	var label = 'Person'
	var Person = new Model(label, definition)
	var person = Person.instantiate()
	describe('#constructor', function () {
		it('should be able to create a model instance', function () {
			person.definition.should.eql(definition)
			person.label.should.eql(label)
		})
		it('should be able to create a model instance with params', function () {
			var person = Person.instantiate({firstName: 'x', lastName: 'y'})
			person.firstName.should.eql('x')
			person.lastName.should.eql('y')
		})
		it('should be able to get and set properties only by the dot notation', function () {
			var firstName = 'Blonde Girl'
			var id = 123124
			person.id = id
			person.firstName = firstName
			assert.equal(person.firstName, firstName)
			assert.equal(person.id, id)
		})
	})
	describe('#get #set', function () {
		it('should be able to get and set properties by the getters and setters', function () {
			var id = 12345
			var firstName = 'Blonde Girl'
			person.set('firstName', firstName)
			person.set('id', id)
			assert.equal(person.get('firstName'), firstName)
			assert.equal(person.get('id'), id)
		})
	})
})