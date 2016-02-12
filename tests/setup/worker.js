/**
 * Created by Dragos on 5/20/14.
 */

var Promise = require('bluebird')
var Bootstrapper = require('../../compiled/Bootstrapper').default
Promise.longStackTraces()

var QueryBuilder = require('../../compiled/QueryBuilder')
var FieldTypes = require('../../compiled/FieldTypes')
var _ = require('lodash')
var moment = require('moment')
var Person = require('./testModels').Person
var Role = require('./testModels').Role
var Location = require('./testModels').Location
var Toy = require('./testModels').Toy
var Car = require('./testModels').Car
var bs = new Bootstrapper([Person, Role, Location, Toy, Car])

var db = {
	server: "http://localhost:7474",
	user: "neo4j",
	pass: "neo4j1"
}

bs.db(db).initialize()

var peopleNumber = 5
var locationsNumber = 3
var toysNumber = 10
var date = new Date()
var preferredColors = ['black','yellow','white']
var resetDbQuery = 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'

var work = function() {
	var deferred = Promise.defer()
	Person.seraph().query(resetDbQuery, {}, function(err, result){
			var promises = []

			var people = []

			for(var i = 0; i<peopleNumber; i++) {

				var person = Person.instantiate()
				person.firstName = 'Henry_'+i
				person.lastName = 'Ford_'+i
				person.isActive = true
				person.siteVisits = 0
				person.jsonData = {x:1,y:2}
				person.preferredColors = preferredColors
				person.bornDate = date
				var role = Role.instantiate()
				role.description = 'vip_role_'+i
				person.role = role
				var car = Car.instantiate({name: 'Honda_'+i})
				person.car = car
				_.each(_.range(0,locationsNumber), function(i){
					var l = Location.instantiate()
					l.coord = 'USA_'+i
					person.locations.push(l)
				})
				_.each(_.range(0,toysNumber), function(i){
					var t = Toy.instantiate()
					t.name = 'toy_'+i
					person.toys.push(t)
				})
				people.push(person)
				promises.push(person.save())
			}

			Promise.all(promises)
				.then(function(){
					return deferred.resolve()
				})
				.catch(function(err){
					return deferred.reject(err)
				})
		})
	return deferred.promise
}

var undoWork = function() {
	var deferred = Promise.defer()
	db.queryOneScalarAsync(resetDbQuery, {})
		.then(function(){
			deferred.resolve()
		})
		.catch(function(err){
			deferred.reject(err)
		})
	return deferred.promise
}

module.exports = {
	work: work,
	undoWork: undoWork,
	peopleNumber: peopleNumber,
	locationsNumber: locationsNumber,
	toysNumber: toysNumber,
	preferredColors: preferredColors,
	date: date
}
