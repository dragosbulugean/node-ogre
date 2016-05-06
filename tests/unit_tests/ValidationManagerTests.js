/**
 * Created by Dragos on 3/12/15.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import Model from '../../sources/Model'
import FieldTypes from '../../sources/FieldTypes'
import ValidationManager from '../../sources/ValidationManager'

describe('ValidationManager', () => {
	describe('#validateType', () => {
		it('should be able to detect wrong types', () => {
/*			let result
			result = ValidationManager.validateType(String, "x")
			should.not.exist(result)
			result = ValidationManager.validateType(String, new Date())
			result.should.exist()
			result = ValidationManager.validateType(Number, 5)
			should.not.exist(result)
			result = ValidationManager.validateType(Number, new Date())
			result.should.exist()
			result = ValidationManager.validateType(Date, new Date())
			should.not.exist(result)
			result = ValidationManager.validateType(Date, 5)
			result.should.exist()
			result = ValidationManager.validateType(JSON, {x:1,y:2})
			should.not.exist(result)
			result = ValidationManager.validateType(JSON, "xx")
			result.should.exist()
			result = ValidationManager.validateType(Array, [1,2,3])
			should.not.exist(result)
			result = ValidationManager.validateType(Array, new Date())
			result.should.exist()*/
		})
	})
})