import Schema from './schema'
import Model from './model'
import * as _ from 'lodash'
import * as Bluebird from 'bluebird'
const seraph = require("seraph")

export default class Ogre {
    
    url: string
    user: string
    password: string
    seraph: any
    schemas: Schema[]
    
    constructor(url: string, user: string, password: string, schemas?: Schema[]) {
        this.url = url
        this.user = user
        this.password = password
        this.seraph = seraph({
            server: this.url,
            user: this.user,
            pass: this.password
        })
        Bluebird.promisifyAll(this.seraph)
        this.schemas = schemas || []
        this.schemas.forEach(model => {
          model.setSeraph(this.seraph)
        })
        if(!_.isEmpty(this.schemas)) 
            this.checkSchemas(this.schemas)
    }

    checkSchemas(schemas: Schema[]): void {
        let schemaMap = {}
        schemas.forEach(schema => {
            let label = schema.label
            schemaMap[label] = schema
        })        
        let allRelations = []
        schemas.forEach(schema => {
            for (let key in schema.fields) {
                let field = schema.fields[key]
                if(field instanceof Relation) 
                    allRelations.push(field)
            }
        })
        allRelations.forEach(rel => {
            if(!_.has(schemaMap, rel.toSchemaString)) 
                throw new Error(`${rel.toSchemaString} was not found in your schema definitions.`)
            else
                rel.setToSchema(schemaMap[rel.toSchemaString])
        })
        // for (let schemaKey in schemaMap) {
        //     let schema = schemaMap[schemaKey]
        //     for (let fieldKey in schema.fields) {
        //         let field = schema.fields[fieldKey]
        //         if(field instanceof Relation) {

        //         } 
        //     }
        // }
    }

    query(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.seraph.queryAsync(query)
                .then(response => {
                    return resolve(response)
                })
                .catch(error => {
                    return reject(error)
                })
        })
    }
      
}

export let Directions = {
	In           : '<',
	Out          : '>',
	InOut        : '<>'
}

export interface Predicate {
    field: string,
    operator: string,
    value: any,
    continuation?: string
}

export class Relation {

    toSchemaString: string
    toSchema: Schema
    type: string
    direction: string

    constructor(toSchemaString: string, type: string, direction?: string) {
        this.toSchemaString = toSchemaString
        this.type = type
        this.direction = direction
    }

    setToSchema(toSchema: Schema) {
        this.toSchema = toSchema
    }

} 

//Left here for documentation purposes
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

