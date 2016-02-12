/**
 * Created by Dragos on 7/3/14.
 */

var chai = require("chai")
var should = chai.should()
var expect = chai.expect
var	assert = chai.assert

var MapNameUtility = require("../../compiled/MapNameUtility").default

describe('MapNameUtility', function(){
	var mnu = new MapNameUtility()
	describe('#constructor', function(){
		it('should be able to create an instance', function(){
			assert.typeOf(mnu, 'object')
		})
	})
	describe('#getCurrentMapName', function(){
		it('should get undefined on first call', function(){
			should.not.exist(mnu.getCurrentMapName())
		})
	})
	describe('#setGetNextMapName', function(){
		it('should get m_0 on first call to setGetNextMapName', function(){
			assert.equal(mnu.setGetNextMapName(), 'm_0')
		})
		it('should increase counter on map name when calling setGetNextMapName', function(){
			assert.equal(mnu.setGetNextMapName(), 'm_1')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getLastMapName', function(){
		it('should get last map name without messing with the currentMapName', function(){
			assert.equal(mnu.getLastMapName(), 'm_0')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getNextMapName', function(){
		it('should get next map name without messing with the currentMapName', function(){
			assert.equal(mnu.getNextMapName(), 'm_2')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getCurrentRelationMapName', function(){
		it('should get undefined on first call', function(){
			should.not.exist(mnu.getCurrentRelationMapName())
		})
	})
	describe('#setGetNextRelationMapName', function(){
		it('should m_0 without tampering with currentRelationMap value', function(){
			assert.equal(mnu.setGetNextRelationMapName(), 'rm_0')
			assert.equal(mnu.getCurrentRelationMapName(), 'rm_0')
		})
	})
	describe('#getMapNames', function(){
		it('should get previous used map names', function(){
			mnu.setGetNextMapName()
			mnu.setGetNextMapName()
			mnu.setGetNextMapName()
			expect(mnu.getMapNames()).to.eql(['m_4', 'm_3', 'm_2', 'm_1', 'm_0'])
		})
	})
	describe('#getRelationMapNames', function(){
		it('should get previous used relation map names', function(){
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			expect(mnu.getRelationMapNames()).to.eql(['rm_3', 'rm_2', 'rm_1', 'rm_0'])
		})
	})
	describe('#getAllUsedMapNames', function(){
		it('should get all previous map names', function(){
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			expect(mnu.getRelationMapNames()).to.eql(['rm_6','rm_5','rm_4','rm_3', 'rm_2', 'rm_1', 'rm_0'])
		})
	})
})
