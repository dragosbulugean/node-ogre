/**
 * Created by Dragos on 3/12/15.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import _ from 'lodash'
import Model from '../../sources/Model'
import FieldTypes from '../../sources/FieldTypes'
import Bootstrapper from '../../sources/Bootstrapper'

import * as testModels from '../setup/testModels'
let modelArray = []
_.each(testModels, (v,k) => {
	modelArray.push(v)
})

describe('Bootstrapper', () => {
	describe('#models', () => {
		it('should be able to add models', () => {
			let bs = new Bootstrapper()
			bs.models(modelArray)
			bs.models().should.be.eql(modelArray)
		})
	})
})