/**
 * Created by Dragos on 3/12/15.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var _ = require('lodash')
var Model = require("../../compiled/Model")
var FieldTypes = require("../../compiled/FieldTypes")
var Bootstrapper = require("../../compiled/Bootstrapper").default

var testModels = require('../setup/testModels')
var modelArray = []
_.each(testModels, function(v,k){
	modelArray.push(v)
})

describe('Bootstrapper', function(){
	describe('#models', function(){
		it('should be able to add models', function(){
			var bs = new Bootstrapper()
			bs.models(modelArray)
			bs.models().should.be.eql(modelArray)
		})
	})
})