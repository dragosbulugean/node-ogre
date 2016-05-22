import Schema from './schema'
let neo4j = require('neo4j-driver')

export default class Ogre {
    
    driver: string
    schemas: any[]
    
    constructor(driver: string, schemas: any[]) {
        this.driver = driver
        this.schemas = schemas
    }
      
}