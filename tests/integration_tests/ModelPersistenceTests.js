/**
 * Created by Dragos on 5/20/14.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import Promise from 'bluebird'
Promise.longStackTraces()
import _ from 'lodash'
import Constants from '../../sources/Constants'

import { Person, Role, Location } from '../setup/testModels'
import * as worker from '../setup/worker'

describe('Model [Persistence]', () => {
	before(() => {
		return worker.work()
	})
	after(() => {
		//return worker.undoWork()
	})
	describe('#save', () => {
		it('saves model properties and all related models', (done) => {
			Person.findAll()
				.then((people) => {
					_.each(people, (person) => {
						person.should.have.property('locations').with.lengthOf(worker.locationsNumber)
						_.each(person.locations, (location) => {
							location.should.be.an('number')
						})
						person.isActive.should.be.an('boolean').and.be.eql(true)
						//person.preferredColors.should.be.an('array').and.be.eql(worker.preferredColors)
						person.siteVisits.should.be.an('number').and.be.eql(0)
						person.jsonData.should.be.an('object')
						person.bornDate.should.be.an('date').and.be.eql(worker.date)
						person.should.have.property('role')
						person.role.should.be.an('number')
					})
					done()
				})
		})
		it('updates model relations', (done) => {
			Person.findRandom(1, null, ['role', 'locations'])
				.then((people) => {
					let person = _.head(people)
					let newFirstName = 'Elon'
					let newLastName = null
					person.firstName = newFirstName
					person.lastName = newLastName
					let newRoleDesc = 'xxxxx'
					person.role = Role.instantiate({description: newRoleDesc})
					person.locations = []
					let locationsNr = 10
					_.each(_.range(locationsNr), (v) => {
						person.locations.push(Location.instantiate({coord:"location"+v}))
					})
					person.save()
						.then((psaved) => {
							Person.findById(person.id, null, ['role', 'locations'])
								.then((p) => {
									p.firstName.should.be.eql(newFirstName)
									should.equal(p.lastName, null)
									p.should.have.property('locations').with.lengthOf(locationsNr)
									p.role.description.should.eql(newRoleDesc)
									done()
								})
						})
				})
		})
	})
	describe('#remove', () => {
		it('soft removes model in datastore', (done) => {
			Person.instantiate({firstName: 'Billy', lastName:'Boy'}).save()
				.then((person) => {
					person.remove()
						.then(() => {
							Person.seraph().readLabels(person.id, (err, p) => {
								p[0].should.be.eql("_"+person.label)
								done()
							})
						})
				})
		})
	})
	describe('#hardRemove', () => {
		it('hard removes model from datastore', (done) => {
			Person.instantiate({firstName: 'Billy', lastName:'Boy'}).save()
				.then((person) => {
					person.hardRemove()
						.then(() => {
							Person.findById(person.id)
								.then((n) => {
									return done()
								})
								.catch((err) => {
									return done()
								})
						})
						.catch((err) => {
							return done()
						})
				})
				.catch((err) => {
					return done()
				})
		})
	})
	describe('#update', () => {
		it('saves model properties', (done) => {
			let personData = {
				firstName: 'Johnny',
				lastName: 'Cash'
			}
			Person.instantiate(personData).save()
				.then((p) => {
					Person.findById(p.id)
						.then((person) => {
							person.firstName.should.be.eql(personData.firstName)
							person.lastName.should.be.eql(personData.lastName)
							done()
						})
				})
		})
		it('updates model properties', (done) => {
			Person.findRandom(1)
				.then((people) => {
					let person = _.head(people)
					let newFirstName = 'Elon'
					let newLastName = null
					person.firstName = newFirstName
					person.lastName = newLastName
					person.isActive = null
					person.save()
						.then(() => {
							Person.findById(person.id)
								.then((p) => {
									p.firstName.should.be.eql(newFirstName)
									should.equal(p.lastName, null)
									should.equal(p.isActive, null)
									done()
								})
						})
						.catch((err) => {
							console.log(err)
						})
				})
		})
	})
})

