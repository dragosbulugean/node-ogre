/**
 * Created by Dragos on 7/3/14.
 */

import chai from 'chai'
let should = chai.should()
let expect = chai.expect
let	assert = chai.assert

import MapNameUtility from '../../sources/MapNameUtility'

describe('MapNameUtility', () => {
	let mnu = new MapNameUtility()
	describe('#constructor', () => {
		it('should be able to create an instance', () => {
			assert.typeOf(mnu, 'object')
		})
	})
	describe('#getCurrentMapName', () => {
		it('should get undefined on first call', () => {
			should.not.exist(mnu.getCurrentMapName())
		})
	})
	describe('#setGetNextMapName', () => {
		it('should get m_0 on first call to setGetNextMapName', () => {
			assert.equal(mnu.setGetNextMapName(), 'm_0')
		})
		it('should increase counter on map name when calling setGetNextMapName', () => {
			assert.equal(mnu.setGetNextMapName(), 'm_1')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getLastMapName', () => {
		it('should get last map name without messing with the currentMapName', () => {
			assert.equal(mnu.getLastMapName(), 'm_0')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getNextMapName', () => {
		it('should get next map name without messing with the currentMapName', () => {
			assert.equal(mnu.getNextMapName(), 'm_2')
			assert.equal(mnu.getCurrentMapName(), 'm_1')
		})
	})
	describe('#getCurrentRelationMapName', () => {
		it('should get undefined on first call', () => {
			should.not.exist(mnu.getCurrentRelationMapName())
		})
	})
	describe('#setGetNextRelationMapName', () => {
		it('should m_0 without tampering with currentRelationMap value', () => {
			assert.equal(mnu.setGetNextRelationMapName(), 'rm_0')
			assert.equal(mnu.getCurrentRelationMapName(), 'rm_0')
		})
	})
	describe('#getMapNames', () => {
		it('should get previous used map names', () => {
			mnu.setGetNextMapName()
			mnu.setGetNextMapName()
			mnu.setGetNextMapName()
			expect(mnu.getMapNames()).to.eql(['m_4', 'm_3', 'm_2', 'm_1', 'm_0'])
		})
	})
	describe('#getRelationMapNames', () => {
		it('should get previous used relation map names', () => {
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			expect(mnu.getRelationMapNames()).to.eql(['rm_3', 'rm_2', 'rm_1', 'rm_0'])
		})
	})
	describe('#getAllUsedMapNames', () => {
		it('should get all previous map names', () => {
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			mnu.setGetNextRelationMapName()
			expect(mnu.getRelationMapNames()).to.eql(['rm_6','rm_5','rm_4','rm_3', 'rm_2', 'rm_1', 'rm_0'])
		})
	})
})
