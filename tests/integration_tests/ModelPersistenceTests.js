/**
 * Created by Dragos on 5/20/14.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var Promise = require('bluebird')
Promise.longStackTraces()
var _ = require('lodash')
var Person = require('../setup/testModels').Person
var Errors = require('../../compiled/Errors')
var Role = require('../setup/testModels').Role
var Location = require('../setup/testModels').Location
var worker = require('../setup/worker')
var Constants = require('../../compiled/Constants')

describe('Model [Persistence]', function(){
	this.timeout(0)
	before(function(){
		return worker.work()
	})
	after(function(){
		//return worker.undoWork()
	})
	describe('#save', function(){
		it('saves model properties and all related models', function(done){
			Person.findAll()
				.then(function(people){
					_.each(people, function(person){
						person.should.have.property('locations').with.lengthOf(worker.locationsNumber)
						_.each(person.locations, function(location){
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
		it('updates model relations', function(done){
			Person.findRandom(1, null, ['role', 'locations'])
				.then(function(people){
					var person = _.head(people)
					var newFirstName = 'Elon'
					var newLastName = null
					person.firstName = newFirstName
					person.lastName = newLastName
					var newRoleDesc = 'xxxxx'
					person.role = Role.instantiate({description: newRoleDesc})
					person.locations = []
					var locationsNr = 10
					_.each(_.range(locationsNr), function(v){
						person.locations.push(Location.instantiate({coord:"location"+v}))
					})
					person.save()
						.then(function(psaved){
							Person.findById(person.id, null, ['role', 'locations'])
								.then(function(p){
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
	describe('#remove', function(){
		it('soft removes model in datastore', function(done){
			Person.instantiate({firstName: 'Billy', lastName:'Boy'}).save()
				.then(function(person){
					person.remove()
						.then(function(){
							Person.seraph().readLabels(person.id, function(err, p){
								p[0].should.be.eql("_"+person.label)
								done()
							})
						})
				})
		})
	})
	describe('#hardRemove', function(){
		it('hard removes model from datastore', function(done){
			Person.instantiate({firstName: 'Billy', lastName:'Boy'}).save()
				.then(function(person){
					person.hardRemove()
						.then(function(){
							Person.findById(person.id)
								.then(function(n){
									return
								})
								.catch(function(err){
									return done()
								})
						})
				})
		})
	})
	describe('#update', function(){
		it('saves model properties', function(done) {
			var personData = {
				firstName: 'Johnny',
				lastName: 'Cash'
			}
			Person.instantiate(personData).save()
				.then(function(p){
					Person.findById(p.id)
						.then(function(person){
							person.firstName.should.be.eql(personData.firstName)
							person.lastName.should.be.eql(personData.lastName)
							done()
						})
				})
		})
		it('updates model properties', function (done) {
			Person.findRandom(1)
				.then(function (people) {
					var person = _.head(people)
					var newFirstName = 'Elon'
					var newLastName = null
					person.firstName = newFirstName
					person.lastName = newLastName
					person.isActive = null
					person.save()
						.then(function () {
							Person.findById(person.id)
								.then(function (p) {
									p.firstName.should.be.eql(newFirstName)
									should.equal(p.lastName, null)
									should.equal(p.isActive, null)
									done()
								})
						})
						.catch(function (err) {
							console.log(err)
						})
				})
		})
	})
})

