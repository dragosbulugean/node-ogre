/**
 * Created by Dragos on 5/20/14.
 */

let Promise = require('bluebird')
Promise.longStackTraces()

import Bootstrapper from '../../sources/Bootstrapper'
import QueryBuilder from '../../sources/QueryBuilder'
import FieldTypes from '../../sources/FieldTypes'
import _ from 'lodash'
import moment from 'moment'

import {Person, Role, Location, Toy, Car} from './testModels'
let bs = new Bootstrapper([Person, Role, Location, Toy, Car])

let db = {
	server: "http://localhost:7474",
	user: "neo4j",
	pass: "neo4j1"
}

bs.db(db).initialize()

let peopleNumber = 5
let locationsNumber = 3
let toysNumber = 10
let date = new Date()
let preferredColors = ['black','yellow','white']
let resetDbQuery = 'MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r'

let work = () => {
	let deferred = Promise.defer()
	Person.seraph().query(resetDbQuery, {}, (err, result) => {
			let promises = []
			let people = []
			for(let i = 0; i<peopleNumber; i++) {
				let person = Person.instantiate()
				person.firstName = 'Henry_'+i
				person.lastName = 'Ford_'+i
				person.isActive = true
				person.siteVisits = 0
				person.jsonData = {x:1,y:2}
				person.preferredColors = preferredColors
				person.bornDate = date
				let role = Role.instantiate()
				role.description = 'vip_role_'+i
				person.role = role
				let car = Car.instantiate({name: 'Honda_'+i})
				person.car = car
				_.each(_.range(0,locationsNumber), (i) => {
					let l = Location.instantiate()
					l.coord = 'USA_'+i
					person.locations.push(l)
				})
				_.each(_.range(0,toysNumber), (i) => {
					let t = Toy.instantiate()
					t.name = 'toy_'+i
					person.toys.push(t)
				})
				people.push(person)
				promises.push(person.save())
			}

			Promise.all(promises)
				.then(() => {
					return deferred.resolve()
				})
				.catch((err) => {
					return deferred.reject(err)
				})
		})
	return deferred.promise
}

let undoWork = () => {
	let deferred = Promise.defer()
	db.queryOneScalarAsync(resetDbQuery, {})
		.then(() => {
			deferred.resolve()
		})
		.catch((err) => {
			deferred.reject(err)
		})
	return deferred.promise
}

export { work, undoWork, peopleNumber, locationsNumber, toysNumber, preferredColors, date }
