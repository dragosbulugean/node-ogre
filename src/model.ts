import Schema from './Schema'
import * as _ from 'lodash'
import * as cypher from './cypher'

export default class Model {
    
    schema: Schema
    data: any

    constructor(schema: Schema) {
        this.schema = schema
        this.data = {}
    }

    set(key: string, value: any): void {
        if(_.has(this.schema.fields, key)) {
            let passed: boolean = true
            let keyType = this.schema.fields[key]
            
            if(keyType === String) 
                if(!_.isString(value)) passed = false
                else this.data[key] = value

            if(keyType === Number) 
                if(!_.isNumber(value)) passed = false
                else this.data[key] = value

            if(keyType === Boolean) 
                if(!_.isBoolean(value)) passed = false
                else this.data[key] = value

            if(keyType === Date) 
                if(!_.isDate(value)) passed = false
                else this.data[key] = value.getTime()

            if(!passed)
                console.warn(`Type of ${key} provided doesn't match the type 
                              definition in the schema. We can't set property.`)  
            
        } else {
          console.warn(`${this.schema.label} doesn't have a field named ${key} in definition. 
                        We can't set property.`)  
        }
    }

    setBulk(object: any): void {
        for(let key in object) {
            this.set(key, object[key])
        }
    }

    fromDatabaseStructure(object: any): any {
        let data: any = {}
        for(let key in object) {
            let value = object[key]
            if(_.has(this.schema.fields, key)) {
                
                let passed: boolean = true
                let keyType = this.schema.fields[key]
                
                if(keyType === String) 
                    data[key] = value

                if(keyType === Number) 
                    data[key] = value

                if(keyType === Boolean) 
                    data[key] = value

                if(keyType === Date) 
                    data[key] = new Date(value)

            } else {
                console.warn(`${this.schema.label} doesn't have a field named ${key} in definition. 
                              We can't set property.`)  
            }
        }
        return data
    }

    save() {
        return new Promise((resolve, reject) => {
            this.schema.seraph.save(this.data, this.schema.label, (err, node) => {
                if (err) reject(err)
                this.data = this.fromDatabaseStructure(node)
                return resolve(this.data)
            })
        })
    }

    findById(id: number) {
        return new Promise((resolve, reject) => {
            let query = cypher.queryByLabelAndId(this.schema.label, id)
            this.schema.seraph.query(query, (err, nodes) => {
                if(err) return reject(err)
                if(nodes.length == 0) return reject(`Warning: no node found with id=${id}`) 
                if(nodes.length > 1) return reject(`Warning: found more than one node with id=${id}`) 
                this.data = this.fromDatabaseStructure(nodes[0])
                return resolve(this.data)
            })
        })   
    }

    findByExample(predicate) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.find()
        })   
    }

    remove(id?: number) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id
            this.schema.seraph.label(id, [`_${this.schema.label}`], true, function(err) {
                if(err) return reject(err)
                return resolve()
            })
        })   
    }

    hardRemove(id?: number) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id
            this.schema.seraph.delete(id, function(err) {
                if (err) return reject(err)
                return resolve() 
            })
        })   
    }

}