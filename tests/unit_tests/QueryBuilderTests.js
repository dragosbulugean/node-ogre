/**
 * Created by Dragos on 7/11/14.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import QueryBuilder from '../../sources/QueryBuilder'
import * as Models from '../setup/testModels'

describe('QueryBuilder', () => {
	it('should be able to instantiate', () => {
		let qb = new QueryBuilder()
		should.exist(qb)
	})
	it('should be able get and set model', () => {
		let qb = new QueryBuilder()
		qb.model(Models.Person)
		qb.model().should.be.equal(Models.Person)
	})
	it('should be able get and set id', () => {
		let qb = new QueryBuilder()
		let id = 23123123
		qb.id(id)
		qb.id().should.be.equal(id)
	})
	it('should be able get and set id', () => {
		let qb = new QueryBuilder()
		let id = 23123123
		qb.id(id)
		qb.id().should.be.equal(id)
	})
	it('should be able get and set idArray', () => {
		let qb = new QueryBuilder()
		let idArray = [1,3,4,5]
		qb.idArray(idArray)
		qb.idArray().should.be.equal(idArray)
	})
	it('should be able get and set embedList', () => {
		let qb = new QueryBuilder()
		let embedList = ['l','x','c',]
		qb.embedList(embedList)
		qb.embedList().should.be.equal(embedList)
	})
	it('should be able get and set skip', () => {
		let qb = new QueryBuilder()
		let skip = 3
		qb.skip(skip)
		qb.skip().should.be.equal(skip)
	})
	it('should be able get and set limit', () => {
		let qb = new QueryBuilder()
		let limit = 3
		qb.limit(limit)
		qb.limit().should.be.equal(limit)
	})
	it('should be able get and set isCount', () => {
		let qb = new QueryBuilder()
		let isCount = true
		qb.isCount(isCount)
		qb.isCount().should.be.equal(isCount)
	})
	it('should be able to add where clause / throw if no value supplied', () => {
		let qb = new QueryBuilder()
		expect(() => {
			qb.addWhere()
		}).to.throw()
		let clause = {
			operator: 'eq',
			field: 'firstName',
			value: 'x'
		}
		qb.addWhere(clause)
		qb.whereClauses[0].should.eql(clause)
	})
	it('should be able to add sub where clause / throw if no value supplied', () => {
		let qb = new QueryBuilder()
		expect(() => {
			qb.addSubWhere()
		}).to.throw()
		let subClause = {
			operator: 'eq',
			field: 'firstName',
			value: 'x'
		}
		let dummyModel = 'Person'
		qb.addSubWhere(dummyModel, subClause)
		qb.subWhereClauses[dummyModel].should.eql([subClause])
	})
	it('should be able to add where clause with RQL syntax', () => {
		let qb = new QueryBuilder()
		let clause = {
			op: 'eq',
			args: ['firstName', 'x']
		}
		qb.addWhere(clause)
		qb.whereClauses[0].operator.should.eql(clause.op)
		qb.whereClauses[0].field.should.eql(clause.args[0])
		qb.whereClauses[0].value.should.eql(clause.args[1])
	})
	it('should be able to add sub where with RQL syntax', () => {
		let qb = new QueryBuilder()
		let clause = {
			op: 'eq',
			args: ['firstName', 'x']
		}
		let dummyModel = 'Person'
		qb.addSubWhere(dummyModel, clause)
		qb.subWhereClauses[dummyModel][0].operator.should.eql(clause.op)
		qb.subWhereClauses[dummyModel][0].field.should.eql(clause.args[0])
		qb.subWhereClauses[dummyModel][0].value.should.eql(clause.args[1])
	})
	it('should be able add embed property', () => {
		let qb = new QueryBuilder()
		let embedList = ['x','y','z']
		qb.addEmbedProperty(embedList[0])
		qb.embedList().should.be.eql([embedList[0]])
		qb.addEmbedProperty(embedList)
		qb.embedList().should.be.eql(embedList)
	})
	it('should be able add select property', () => {
		let qb = new QueryBuilder()
		let selectList = ['x','y','z']
		qb.addSelectProperty(selectList[0])
		qb.selectList().should.be.eql([selectList[0]])
		qb.addSelectProperty(selectList)
		qb.selectList().should.be.eql(selectList)
	})
	it('should be able add orderBy', () => {
		let qb = new QueryBuilder()
		let orderBy = {fields: ['x', 'y'], direction: 'ASC'}
		qb.orderBy(orderBy)
		qb.orderBy().fields.should.be.eql(orderBy.fields)
		qb.orderBy().direction.should.be.eql(orderBy.direction)
	})
})