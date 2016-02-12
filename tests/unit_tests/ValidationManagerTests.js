/**
 * Created by Dragos on 3/12/15.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var Model = require("../../compiled/Model")
var FieldTypes = require("../../compiled/FieldTypes")
var ValidationManager = require("../../compiled/ValidationManager")

describe('ValidationManager', function(){
	describe('#validateType', function(){
		it('should be able to detect wrong types', function(){
/*			var result
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