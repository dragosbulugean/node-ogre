/**
 * Created by Dragos on 7/11/14.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import Model from '../../sources/Model'

describe('Model', () => {
	let definition = {
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
	let label = 'Person'
	let Person = new Model(label, definition)
	let person = Person.instantiate()
	describe('#constructor',  () => {
		it('should be able to create a model instance',  () => {
			person.definition.should.eql(definition)
			person.label.should.eql(label)
		})
		it('should be able to create a model instance with params',  () => {
			let person = Person.instantiate({firstName: 'x', lastName: 'y'})
			person.firstName.should.eql('x')
			person.lastName.should.eql('y')
		})
		it('should be able to get and set properties only by the dot notation',  () => {
			let firstName = 'Blonde Girl'
			let id = 123124
			person.id = id
			person.firstName = firstName
			assert.equal(person.firstName, firstName)
			assert.equal(person.id, id)
		})
	})
	describe('#get #set',  () => {
		it('should be able to get and set properties by the getters and setters',  () => {
			let id = 12345
			let firstName = 'Blonde Girl'
			person.set('firstName', firstName)
			person.set('id', id)
			assert.equal(person.get('firstName'), firstName)
			assert.equal(person.get('id'), id)
		})
	})
})