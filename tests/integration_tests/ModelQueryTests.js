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
import QueryBuilder from '../../sources/QueryBuilder'

import { Person, Role, Location } from '../setup/testModels'
import * as worker from '../setup/worker'

describe('Model [Query]', () => {
	before(() => {
		return worker.work()
	})
	after(() => {
		//return worker.undoWork()
	})
	describe('#findAll', () => {
		it('finds all models/nodes', (done) => {
			Person.findAll()
				.then((p) => {
					assert.equal(p.length, worker.peopleNumber)
					done()
				})
		})
	})
	describe('#findById', () => {
		it('finds by id', (done) => {
			Person.findAll()
				.then((people) => {
					let person = _.head(people)
					let id = person.id
					Person.findById(id)
						.then((p) => {
							p.id.should.be.eql(id)
							done()
						})
				})
		})
		it('finds by id with selection', (done) => {
			Person.findAll()
				.then((people) => {
					let person = _.head(people)
					Person.findById(person.id, ['firstName'])
						.then((p) => {
							p.should.not.have.property('lastName')
							p.should.not.have.property('isActive')
							p.should.not.have.property('siteVisits')
							p.should.not.have.property('jsonData')
							p.should.not.have.property('preferredColors')
							p.should.not.have.property('bornDate')
							done()
						})
				})
		})
		it('finds by id with embedding', (done) => {
			Person.findAll()
				.then((people) => {
					let person = _.head(people)
					Person.findById(person.id, null, ['locations', 'role'])
						.then((p) => {
							p.id.should.be.eql(person.id)
							p.role.label.should.eql('Role')
							_.each(p.locations, (l) => {
								l.label.should.eql('Location')
							})
							done()
						})
				})
		})
	})
	describe('#findByExample', () => {
		it('finds by example', (done) => {
			let queryName = 'Henry_1'
			Person.findByExample({firstName: queryName})
				.then((p) => {
					_.each(p, (p) => {
						assert.equal(p.firstName, queryName)
					})
					done()
				})
			Person.findByExample({isActive: true})
				.then((p) => {
					assert.equal(p.length, worker.peopleNumber)
				})
		})
	})
	describe('#findByExample', () => {
		it('finds by example', (done) => {
			let queryName = 'Henry_1'
			Person.findAll()
				.then((p) => {
					Person.findByIdArray([p[0].id,p[1].id,p[2].id])
						.then((people) => {
							assert.equal(people[0].id, p[0].id)
							assert.equal(people[1].id, p[1].id)
							assert.equal(people[2].id, p[2].id)
						})
						.catch(() => {

						})
					done()
				})
		})
	})
	describe('#findByQueryString', () => {
		it('finds by raw query', (done) => {
			let query = 'MATCH (n:Person) RETURN n'
			Person.findByQueryString(query)
				.then((people) => {
					_.each(people, (p) => {
						p.should.have.property('id')
						p.should.have.property('lastName')
						p.should.have.property('isActive')
						p.should.have.property('siteVisits')
						p.should.have.property('jsonData')
						p.should.have.property('preferredColors')
						p.should.have.property('bornDate')
					})
					done()
				})
		})
	})
	describe('#findByQueryBuilder', () => {
		it('finds by query builder', (done) => {
			let queryName1 = 'Henry_1'
			let queryName2 = 'Ford_1'
			let where1 = {
				operator: 'eq',
				field: 'firstName',
				value: queryName1
			}
			let where2 = {
				operator: 'eq',
				field: 'firstName',
				value: queryName2
			}
			let subWhere = {
				operator: 'eq',
				field: 'id',
				value: 1
			}
			let q1 = new QueryBuilder()
						.addWhere(where1)
					    .addWhere(where2,'OR')
					    .addSubWhere('role', subWhere)
			Person.findByQueryBuilder(q1)
				.then((p) => {
					_.each(p, (p) => {
						assert.equal(p.firstName, queryName)
					})
					done()
				})
		})
		it('finds and orders by query builder', (done) => {
			let q1 = new QueryBuilder().orderBy({fields:['firstName'], direction: 'ASC'})
			Person.findByQueryBuilder(q1)
				.then((p) => {
					let isSorted = _.every(p, (value, index, p)  => {
						return index === 0 || String(p[index - 1]) <= String(value)
					})
					isSorted.should.be.eql(true)
					done()
				})
		})
		it('finds, limits', (done) => {
			let q1 = new QueryBuilder().limit(2)
			Person.findByQueryBuilder(q1)
				.then((p) => {
					assert.equal(p.length, 2)
					done()
				})
		})
	})
	describe('#findRandom', () => {
		it('finds random nodes', (done) => {
			Person.findRandom(3)
				.then((p) => {
					assert.equal(p.length, 3)
					done()
				})
		})
	})
})
