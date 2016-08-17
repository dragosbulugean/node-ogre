import Schema from './Schema'
import * as _ from 'lodash'
import * as cypher from './cypher'
import * as validator from './validator'
import {Predicate} from './ogre'

export default class Model {
    
    schema: Schema

    constructor(schema: Schema) {
        this.schema = schema
    }

    type(): string{
        return this.schema.label
    }

    toDatabaseStructure(object: any): any {
        let data: any = {}
        for(let key in object) {
            let value = object[key]
            if(_.has(this.schema.fields, key)) {
                let keyType = this.schema.fields[key]
                if(keyType === Date) {
                    data[key] = value.getTime()
                } else if (keyType === JSON) {
                    data[key] = JSON.stringify(value)
                } else {
                    data[key] = value
                }
            }
        }
        return data
    }

    fromDatabaseStructure(object: any): any {
        let data: any = {}
        for(let key in object) {
            let value = object[key]
            if(_.has(this.schema.fields, key)) {     
                let keyType = this.schema.fields[key]
                let [passed, valueCorrected] = 
                    validator.validateDataFromDbAndConvert(keyType, value)
                if(!passed)
                    throw new Error(`Type of ${key} provided by DB doesn't match the type 
                                     definition in the schema. We can't set property.`)
                else
                    data[key] = valueCorrected  

            } else {
                throw new Error(
                    `${this.schema.label} doesn't have a field named ${key} in definition. 
                    We can't set property.`)  
            }
        }
        return data
    }

    save(data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.saveAsync(this.toDatabaseStructure(data), this.schema.label)
                .then(node => {
                    let result = this.fromDatabaseStructure(node)
                    return resolve(result)
                })
                .catch(error => {
                    return reject(error)
                })
        })
    }

    saveRelation(field: string, node1: any, node2: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if(_.has(this.schema.fields, field)) {
                if(_.isUndefined(node1.id) || _.isUndefined(node2.id)) 
                    return reject(`Model or relatedToModel doesn't have id. We cannot save the relation.`)
                let type = this.schema.fields[field].type
                let query = cypher.relateNodes(node1.id, node2.id, type)
                this.schema.seraph.queryAsync(query)
                    .then(result => {
                        return resolve(result)
                    })
                    .catch(error => {
                        return reject(error)
                    })
            } else {
                throw new Error(`${field} not found in schema ${this.schema}`)
            }
        })
    }

    findById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!id) return reject('`Warning: findById was called without the id parameter.')
            let query = cypher.queryByLabelAndId(this.schema.label, id)
            this.schema.seraph.queryAsync(query)
                .then(nodes => {
                    if(nodes.length == 0) return reject(`Warning: no node found with id=${id}`) 
                    if(nodes.length > 1) return reject(`Warning: found more than one node with id=${id}`) 
                    return resolve(this.fromDatabaseStructure(nodes[0]))
                })
                .catch(error => {
                    return reject(error)
                })
        })   
    }

    findByExample(predicates: Predicate[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.queryAsync(cypher.queryFromPredicates(this.schema.label, predicates))
                .then(nodes => {
                    let wrappedNodes = []
                    nodes.forEach(node => {
                        wrappedNodes.push(this.fromDatabaseStructure(node))
                    })
                    return resolve(wrappedNodes)
                })
                .catch(error => {
                    return reject(error)
                })
        })   
    }

    fetchRelation(relation: string): Promise<any> {
        return new Promise((resolve, reject) => {
        })
    }

    fetchRelations(relations: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
        })
    }  

    remove(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.labelAsync(id, [`_${this.schema.label}`], true)
                .then(() => {
                    return resolve()
                })
                .catch(error => {
                    return reject(error)
                })             
        })   
    }

    hardRemove(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.deleteAsync(id)
                .then(()=>{
                    return resolve() 
                })
                .catch(error => {
                    return reject(error)
                })
        })   
    }

    count(): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = cypher.queryCount(this.schema.label)
            this.schema.seraph.queryAsync(query)
                .then(count => {
                    if (!count) return resolve(0)
                    let key = Object.keys(count[0])[0]
                    let c = count[0][key]
                    return resolve(c) 
                })
                .catch(error => {
                    return reject(error)
                })
        })   
    }

}