/**
 * Created by Dragos on 8/14/14.
 */

import Model from '../../sources/Model'
import FieldTypes from '../../sources/FieldTypes'

let Person = new Model('Person', {
	id: {
		type: Number
	},
	firstName: {
		type: String
	},
	lastName: {
		type: String
	},
	isActive: {
		type: Boolean
	},
	siteVisits: {
		type: Number
	},
	jsonData: {
		type: FieldTypes.JSON
	},
	preferredColors: {
		type: FieldTypes.Array
	},
	bornDate: {
		type: Date
	},
	role: {
		type: new FieldTypes.OneRelation({
			to: 'Role',
			relationType: 'has_role'
		})
	},
	car: {
		type: new FieldTypes.OneRelation({
			to: 'Car',
			relationType: 'has'
		})
	},
	locations: {
		type: new FieldTypes.ManyRelation({
			to: 'Location',
			relationType: 'was_in'
		})
	},
	toys: {
		type: new FieldTypes.ManyRelation({
			to: 'Toy',
			relationType: 'has'
		})
	}
})

let Role = new Model('Role', {
	id: {
		type: Number
	},
	description: {
		type: String
	}
})

let Car = new Model('Car', {
	id: {
		type: Number
	},
	name: {
		type: String
	}
})

let Location = new Model('Location', {
	id: {
		type: Number
	},
	coord: {
		type: String
	}
})

let Toy = new Model('Toy', {
	id: {
		type: Number
	},
	name: {
		type: String
	}
})

export { Person, Role, Location, Toy, Car }