/**
 * Created by Dragos on 6/3/14.
 */

//This module helps keep sanity in map naming in queries.
import _ from 'lodash'

class Neo4jMapNameUtility {

	regulate(mapName, number) {
		return this[mapName].split('_')[0] + '_' +
		 			 (parseInt(this[mapName].split('_')[1])+number)
	}

	getCurrentMapName() {
		return this.currentMapName
	}

	getLastMapName() {
		if(!this.currentMapName) return
		let lastMapName = this.regulate('currentMapName', -1)
		return lastMapName
	}

	setGetLastMapName() {
		if(!this.currentMapName) return
		let lastMapName = this.regulate('currentMapName', -1)
		this.currentMapName = lastMapName;
		return lastMapName
	}

	getNextMapName() {
		if(!this.currentMapName)  return 'm_0'
		let nextMapName = this.regulate('currentMapName', +1)
		return nextMapName
	}

	setGetNextMapName() {
		if(!this.currentMapName) return this.currentMapName = 'm_0'
		let nextMapName = this.regulate('currentMapName', +1)
		this.currentMapName = nextMapName
		return nextMapName
	}

	getCurrentRelationMapName() {
		return this.currentRelationMapName
	}

	getNextRelationMapName() {
		if(!this.currentRelationMapName) return 'rm_0'
		let lastRelationMapName = this.regulate('currentRelationMapName', +1)
		return lastRelationMapName;
	}

	setGetNextRelationMapName() {
		if(!this.currentRelationMapName) return this.currentRelationMapName = 'rm_0'
		let nextRelationMapName = this.regulate('currentRelationMapName', +1)
		this.currentRelationMapName = nextRelationMapName
		return nextRelationMapName;
	}

	getMapNames(current, list) {
		if(!this.currentMapName) return
		if(!list) list = []
		if(!current) current = this.currentMapName
		let nr = parseInt(current.split('_')[1])
		if(nr>=0) {
			list.push(current)
			current = 'm_'+(nr-1)
			this.getMapNames(current,list)
		}
		return list
	}

	getRelationMapNames(current, list) {
		if(!this.currentRelationMapName) return
		if(!list) list = []
		if(!current) current = this.currentRelationMapName
		if(!current) return list
		let nr = parseInt(current.split('_')[1])
		if(nr>=0) {
			list.push(current)
			current = 'rm_'+(nr-1)
			this.getRelationMapNames(current,list)
		}
		return list
	}

	getAllUsedMapNames() {
		let l1 = this.getMapNames() || []
		let l2 = this.getRelationMapNames() || []
		let value = [].concat(l1).concat(l2) + ','
		return value
	}

	getAllUsedMapNamesWithout(mapName) {
		let l1 = this.getMapNames() || []
		l1 = _.difference(l1, [mapName])
		let l2 = this.getRelationMapNames() || []
		l2 = _.difference(l2, [mapName])
		let value = [].concat(l1).concat(l2) + ','
		return value
	}

	reset() {
		delete this.currentMapName
		delete this.currentRelationMapName
	}
}

export default Neo4jMapNameUtility
