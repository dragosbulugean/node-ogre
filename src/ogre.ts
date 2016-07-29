import Schema from './schema'
import Model from './model'
const seraph = require("seraph")

export default class Ogre {
    
    url: string
    user: string
    password: string
    seraph: any
    schemas: Schema[]
    
    constructor(url: string, user: string, password: string, schemas: Schema[]) {
        this.url = url
        this.user = user
        this.password = password
        this.seraph = seraph({
            server: this.url,
            user: this.user,
            pass: this.password
        })
        this.schemas = schemas
        this.schemas.forEach(model => {
          model.setSeraph(this.seraph)
        })
    }

    model(label, schema: Schema) {

    }
      
}

//Let here for documentation purposes
export let Operators =	{
	'and'   : 'AND',
	'or'    : 'OR',
	'in'    : 'IN',
	'eq'    : '=',
	'neq'   : '<>',
	'gt'    : '>',
	'lt'    : '<',
	'gte'   : '>=',
	'lte'   : '<=',
	'regex' : '=~',
	'n'     : 'IS NULL',
	'nn'    : 'IS NOT NULL'
}

export interface Predicate {
    field: string,
    operator: string,
    value: any,
    continuation?: string
}

