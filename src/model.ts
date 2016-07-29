import Schema from './Schema'
import * as _ from 'lodash'
import * as cypher from './cypher'
import * as validator from './validator'
import {Predicate} from './ogre'

export default class Model {
    
    schema: Schema
    data: any

    constructor(schema: Schema) {
        this.schema = schema
        this.data = {}
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
            this.schema.seraph.save(
                this.toDatabaseStructure(this.data), this.schema.label, (err, node) => {
                    if (err) reject(err)
                    this.data = this.fromDatabaseStructure(node)
                    return resolve(this)
                })
        })
    }

    findById(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            if(!id) return reject('`Warning: findById was called without the id parameter.')
            let query = cypher.queryByLabelAndId(this.schema.label, id)
            this.schema.seraph.query(query, (err, nodes) => {
                if(err) return reject(err)
                if(nodes.length == 0) return reject(`Warning: no node found with id=${id}`) 
                if(nodes.length > 1) return reject(`Warning: found more than one node with id=${id}`) 
                return resolve(this.instance(this.fromDatabaseStructure(nodes[0])))
            })
        })   
    }

    findByExample(predicates: Predicate[]): Promise<any> {
        return new Promise((resolve, reject) => {
            this.schema.seraph.query(
                cypher.queryFromPredicates(this.schema.label, predicates), (err, nodes) => {
                    if(err) return reject(err)
                    let wrappedNodes = []
                    nodes.forEach(node => {
                        wrappedNodes.push(this.instance(this.fromDatabaseStructure(node)))
                    })
                    return resolve(wrappedNodes)
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
            this.schema.seraph.label(id, [`_${this.schema.label}`], true, (err) => {
                if(err) return reject(err)
                this.data = {}
                return resolve()
            })
        })   
    }

    hardRemove(id?: number): Promise<any> {
        return new Promise((resolve, reject) => {
            id = id || this.data.id
            this.schema.seraph.delete(id, (err) => {
                if (err) return reject(err)
                this.data = {}
                return resolve() 
            })
        })   
    }

    count(): Promise<any> {
        return new Promise((resolve, reject) => {
            let query = cypher.queryCount(this.schema.label)
            this.schema.seraph.query(query, (err, count) => {
                if (err) return reject(err)
                if (!count) return resolve(0)
                let key = Object.keys(count[0])[0]
                let c = count[0][key]
                return resolve(c) 
            })
        })   
    }

    dropId(): void {
        delete this.data.id
    }

}