/**
 * Created by Dragos on 5/20/14.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var Promise = require('bluebird')
Promise.longStackTraces()
var QueryBuilder = require('../../compiled/QueryBuilder').default
var _ = require('lodash')
var Person = require('../setup/testModels').Person
var Role = require('../setup/testModels').Role
var Location = require('../setup/testModels').Location
var worker = require('../setup/worker')

describe('Model [Query]', function(){
	this.timeout(0)
	before(function(){
		return worker.work()
	})
	after(function(){
		//return worker.undoWork()
	})
	describe('#findAll', function(){
		it('finds all models/nodes', function(done){
			Person.findAll()
				.then(function(p){
					assert.equal(p.length, worker.peopleNumber)
					done()
				})
		})
	})
	describe('#findById', function(){
		it('finds by id', function(done){
			Person.findAll()
				.then(function(people){
					var person = _.head(people)
					var id = person.id
					Person.findById(id)
						.then(function(p){
							p.id.should.be.eql(id)
							done()
						})
				})
		})
		it('finds by id with selection', function(done){
			Person.findAll()
				.then(function(people){
					var person = _.head(people)
					Person.findById(person.id, ['firstName'])
						.then(function(p){
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
		it('finds by id with embedding', function(done){
			Person.findAll()
				.then(function(people){
					var person = _.head(people)
					Person.findById(person.id, null, ['locations', 'role'])
						.then(function(p){
							p.id.should.be.eql(person.id)
							p.role.label.should.eql('Role')
							_.each(p.locations, function(l){
								l.label.should.eql('Location')
							})
							done()
						})
				})
		})
	})
	describe('#findByExample', function(){
		it('finds by example', function(done){
			var queryName = 'Henry_1'
			Person.findByExample({firstName: queryName})
				.then(function(p){
					_.each(p, function(p){
						assert.equal(p.firstName, queryName)
					})
					done()
				})
			Person.findByExample({isActive: true})
				.then(function(p){
					assert.equal(p.length, worker.peopleNumber)
				})
		})
	})
	describe('#findByExample', function(){
		it('finds by example', function(done){
			var queryName = 'Henry_1'
			Person.findAll()
				.then(function(p){
					Person.findByIdArray([p[0].id,p[1].id,p[2].id])
						.then(function(people){
							assert.equal(people[0].id, p[0].id)
							assert.equal(people[1].id, p[1].id)
							assert.equal(people[2].id, p[2].id)
						})
						.catch(function(){

						})
					done()
				})
		})
	})
	describe('#findByQueryString', function(){
		it('finds by raw query', function(done){
			var query = 'MATCH (n:Person) RETURN n'
			Person.findByQueryString(query)
				.then(function(people){
					_.each(people, function(p){
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
	describe('#findByQueryBuilder', function(){
		it('finds by query builder', function(done){
			var queryName1 = 'Henry_1'
			var queryName2 = 'Ford_1'
			var where1 = {
				operator: 'eq',
				field: 'firstName',
				value: queryName1
			}
			var where2 = {
				operator: 'eq',
				field: 'firstName',
				value: queryName2
			}
			var subWhere = {
				operator: 'eq',
				field: 'id',
				value: 1
			}
			var q1 = new QueryBuilder().addWhere(where1)
																 .addWhere(where2,'OR')
																 .addSubWhere('role', subWhere)
			Person.findByQueryBuilder(q1)
				.then(function(p){
					_.each(p, function(p){
						assert.equal(p.firstName, queryName)
					})
					done()
				})
		})
		it('finds and orders by query builder', function(done){
			var q1 = new QueryBuilder().orderBy({fields:['firstName'], direction: 'ASC'})
			Person.findByQueryBuilder(q1)
				.then(function(p){
					var isSorted = _.every(p, function(value, index, p) {
						return index === 0 || String(p[index - 1]) <= String(value)
					})
					isSorted.should.be.eql(true)
					done()
				})
		})
		it('finds, limits', function(done){
			var q1 = new QueryBuilder().limit(2)
			Person.findByQueryBuilder(q1)
				.then(function(p){
					assert.equal(p.length, 2)
					done()
				})
		})
	})
	describe('#findRandom', function(){
		it('finds random nodes', function(done){
			Person.findRandom(3)
				.then(function(p){
					assert.equal(p.length, 3)
					done()
				})
		})
	})
})
