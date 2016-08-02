import Schema from './Schema'
import * as _ from 'lodash'
import * as cypher from './cypher'
import * as validator from './validator'
import {Predicate} from './ogre'

export default class Model {
    
    schema: Schema
    data: any
    private synchronized: boolean

    constructor(schema: Schema) {
        this.schema = schema
        this.data = {}
        this.synchronized = false
        for(let key in schema.fields) {
            Object.defineProperty(this, key, {
                get: (): any => {
                    return this.data[key]
                },
                set: (value: any): any => {
                    this.set(key, value)
                    return this
                },
                configurable: false,
                enumerable: true
            })
        }
    }

    type(): string{
        return this.schema.label
    }

    instance(data?: any): Model {
        let model = new Model(this.schema)
        if(data) model.setBulk(data)
        return model
    }

    getData(): any {
        return this.data
    }

    get(key: string): any {
        if(_.has(this.schema.fields, key)) {
            return this.data[key]
        }
    }

    setBulk(object: any): void {
        for(let key in object) {
            this.set(key, object[key])
        }
    }

    set(key: string, value: any): void {
        if(_.has(this.schema.fields, key)) {
            let keyType = this.schema.fields[key]
            let passed: boolean = validator.validateField(keyType, value)
            if(!passed)
                throw new Error(
                    `Type of ${key} provided by program doesn't match the type 
                    definition in the schema. We can't set field.`)
            else
                this.data[key] = value
                this.synchronized = false
            
        } else {
          throw new Error(
              `${this.schema.label} doesn't have a field named ${key} in definition. 
               We can't set field.`)  
        }
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

    save(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.saveAsync(this.toDatabaseStructure(this.data), this.schema.label)
                .then(node => {
                    this.data = this.fromDatabaseStructure(node)
                    this.synchronized = true
                    return resolve(this)
                })
                .catch(error => {
                    return reject(error)
                })
        })
    }

    saveRelation(field: string, model: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if(_.has(this.schema.fields, field)) {
                if(!this['id']) return reject('Model not saved yet. We cannot relate it to something else.')
                if(_.isUndefined(model['id'])) return reject(`${model.schema.label} isn't saved yet. We cannot relate it to something else.`)
                this.schema.seraph.relateAsync(this['id'], this.schema.fields[field].type, model['id'])
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
                    return resolve(this.instance(this.fromDatabaseStructure(nodes[0])))
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
                        wrappedNodes.push(this.instance(this.fromDatabaseStructure(node)))
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

    remove(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            id = id || this.data.id
            this.schema.seraph.labelAsync(id, [`_${this.schema.label}`], true)
                .then(() => {
                    this.data = {}
                    return resolve()
                })
                .catch(error => {
                    return reject(error)
                })             
        })   
    }

    hardRemove(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            id = id || this.data.id
            this.schema.seraph.deleteAsync(id)
                .then(()=>{
                    this.data = {}
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

    dropId(): void {
        this.data.id = undefined
    }

}