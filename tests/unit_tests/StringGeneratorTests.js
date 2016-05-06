/**
 * Created by Dragos on 7/3/14.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import StringGenerator from '../../sources/StringGenerator'
import * as Constants from '../../sources/Constants'
import * as Models from '../setup/testModels'

describe('StringGenerator', () => {
    let sg = new StringGenerator()
    describe('#constructor',  () => {
        it('should be able to create an instance',  () => {
            sg.should.be.an('object')
            sg.names.should.be.an('object')
        })
    })
    describe('#getRange',  () => {
        it('should return an empty string when no useful values for SKIP and LIMIT are given',  () => {
            sg.getRange().should.equal('')
            sg.getRange(0).should.equal('')
            sg.getRange(0, 0).should.equal('')
        })
        it('should return only SKIP when no useful value for LIMIT is given',  () => {
            sg.getRange(10).should.equal('SKIP 10')
            sg.getRange(10, 0).should.equal('SKIP 10')
        })
        it('should return only LIMIT when no useful value for SKIP is given',  () => {
            sg.getRange(undefined, 10).should.equal('LIMIT 10')
            sg.getRange(0, 10).should.equal('LIMIT 10')
        })
        it('should return LIMIT and SKIP',  () => {
            sg.getRange(5, 10).should.equal('SKIP 5 LIMIT 10')
        })
    })
	describe('#getDirection', () => {
		it('should return in relation', () => {
			sg.getDirection(Constants.Directions.In, 'has_role').should.eql('<-[:has_role]-')
		})
		it('should return out relation', () => {
			sg.getDirection(Constants.Directions.Out, 'has_role', null, true).should.eql('-[:has_role]->')
		})
		it('should return in-out relation', () => {
			sg.getDirection(Constants.Directions.InOut, 'has_role', null, true).should.eql('<-[:has_role]->')
		})
	})
	describe('#getMatch', () => {
		it('should return match', () => {
			sg.getMatch('Person', 'n').should.eql('MATCH (n:Person) ')
		})
	})
	describe('#getWhereId', () => {
		it('should return where id', () => {
			sg.getWhereId('m', 3).should.eql('WHERE id(m)=3 ')
		})
	})
	describe('#getCreate', () => {
		it('should return create string', () => {
			sg.getCreate('Person', 'n', 'm').should.eql('CREATE (n:Person {m}) ')
		})
	})
	describe('#getWhere', () => {
		it('should return where string', () => {
			let where = sg.getWhere('m', '==', 'id', 3)
			where.should.eql('WHERE id(m) == 3')
			where = sg.getWhere('m', 'in', 'id', [1,2,3])
			where.should.eql('WHERE id(m) IN [1,2,3]')
			where = sg.getWhere('m', 'in', 'id', ["a","b","c"])
			where.should.eql('WHERE id(m) IN ["a","b","c"]')
			where = sg.getWhere('m', '=', 'gg', "15")
			where.should.eql('WHERE m.gg = "15"')
			where = sg.getWhere('m', '=', 'gg', 15)
			where.should.eql('WHERE m.gg = 15')
		})
		it('should return where string with continuations', () => {
			let where = sg.getWhere('m', '==', 'id', 3, 'OR')
			where.should.eql('OR id(m) == 3')
			where = sg.getWhere('m', 'in', 'id', [1,2,3], 'AND')
			where.should.eql('AND id(m) IN [1,2,3]')
		})
	})
	describe('#getOrderBy', () => {
		it('should create and return orderby', () => {
			let where = sg.getOrderBy('m', ['fName', 'lName'], 'ASC')
			where.should.eql('ORDER BY m.fName, m.lName ASC')
			where = sg.getOrderBy('m', ['xxx'], 'DESC')
			where.should.eql('ORDER BY m.xxx DESC')
		})
	})
})
