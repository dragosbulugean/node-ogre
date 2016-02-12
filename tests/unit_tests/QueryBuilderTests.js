/**
 * Created by Dragos on 7/11/14.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var QueryBuilder = require("../../compiled/QueryBuilder").default
var Models = require('../setup/testModels')

describe('QueryBuilder', function(){
	it('should be able to instantiate', function(){
		var qb = new QueryBuilder()
		should.exist(qb)
	})
	it('should be able get and set model', function(){
		var qb = new QueryBuilder()
		qb.model(Models.Person)
		qb.model().should.be.equal(Models.Person)
	})
	it('should be able get and set id', function(){
		var qb = new QueryBuilder()
		var id = 23123123
		qb.id(id)
		qb.id().should.be.equal(id)
	})
	it('should be able get and set id', function(){
		var qb = new QueryBuilder()
		var id = 23123123
		qb.id(id)
		qb.id().should.be.equal(id)
	})
	it('should be able get and set idArray', function(){
		var qb = new QueryBuilder()
		var idArray = [1,3,4,5]
		qb.idArray(idArray)
		qb.idArray().should.be.equal(idArray)
	})
	it('should be able get and set embedList', function(){
		var qb = new QueryBuilder()
		var embedList = ['l','x','c',]
		qb.embedList(embedList)
		qb.embedList().should.be.equal(embedList)
	})
	it('should be able get and set skip', function(){
		var qb = new QueryBuilder()
		var skip = 3
		qb.skip(skip)
		qb.skip().should.be.equal(skip)
	})
	it('should be able get and set limit', function(){
		var qb = new QueryBuilder()
		var limit = 3
		qb.limit(limit)
		qb.limit().should.be.equal(limit)
	})
	it('should be able get and set isCount', function(){
		var qb = new QueryBuilder()
		var isCount = true
		qb.isCount(isCount)
		qb.isCount().should.be.equal(isCount)
	})
	it('should be able to add where clause / throw if no value supplied', function(){
		var qb = new QueryBuilder()
		expect(function(){
			qb.addWhere()
		}).to.throw()
		var clause = {
			operator: 'eq',
			field: 'firstName',
			value: 'x'
		}
		qb.addWhere(clause)
		qb.whereClauses[0].should.eql(clause)
	})
	it('should be able to add sub where clause / throw if no value supplied', function(){
		var qb = new QueryBuilder()
		expect(function(){
			qb.addSubWhere()
		}).to.throw()
		var subClause = {
			operator: 'eq',
			field: 'firstName',
			value: 'x'
		}
		var dummyModel = 'Person'
		qb.addSubWhere(dummyModel, subClause)
		qb.subWhereClauses[dummyModel].should.eql([subClause])
	})
	it('should be able to add where clause with RQL syntax', function(){
		var qb = new QueryBuilder()
		var clause = {
			op: 'eq',
			args: ['firstName', 'x']
		}
		qb.addWhere(clause)
		qb.whereClauses[0].operator.should.eql(clause.op)
		qb.whereClauses[0].field.should.eql(clause.args[0])
		qb.whereClauses[0].value.should.eql(clause.args[1])
	})
	it('should be able to add sub where with RQL syntax', function(){
		var qb = new QueryBuilder()
		var clause = {
			op: 'eq',
			args: ['firstName', 'x']
		}
		var dummyModel = 'Person'
		qb.addSubWhere(dummyModel, clause)
		qb.subWhereClauses[dummyModel][0].operator.should.eql(clause.op)
		qb.subWhereClauses[dummyModel][0].field.should.eql(clause.args[0])
		qb.subWhereClauses[dummyModel][0].value.should.eql(clause.args[1])
	})
	it('should be able add embed property', function(){
		var qb = new QueryBuilder()
		var embedList = ['x','y','z']
		qb.addEmbedProperty(embedList[0])
		qb.embedList().should.be.eql([embedList[0]])
		qb.addEmbedProperty(embedList)
		qb.embedList().should.be.eql(embedList)
	})
	it('should be able add select property', function(){
		var qb = new QueryBuilder()
		var selectList = ['x','y','z']
		qb.addSelectProperty(selectList[0])
		qb.selectList().should.be.eql([selectList[0]])
		qb.addSelectProperty(selectList)
		qb.selectList().should.be.eql(selectList)
	})
	it('should be able add orderBy', function(){
		var qb = new QueryBuilder()
		var orderBy = {fields: ['x', 'y'], direction: 'ASC'}
		qb.orderBy(orderBy)
		qb.orderBy().fields.should.be.eql(orderBy.fields)
		qb.orderBy().direction.should.be.eql(orderBy.direction)
	})
})