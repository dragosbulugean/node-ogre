import * as test from 'tape'
import Ogre from '../src/ogre'
import Schema from '../src/schema'
import * as Fields from '../src/fields'
var neo4j = require('neo4j-driver')

test('timing test', function (t) {
    t.plan(1)
    
    let driver = neo4j.v1.driver("bolt://localhost", neo4j.v1.auth.basic("neo4j", "neo4j1"));
    
    class HumanSchema extends Schema {
        
        label = 'Human'
        
        firstName = new Fields.String(
            name = 'firstName'
        )
        
        lastName = new Fields.String(
            name = 'lastName'
        )
        
        age = new Fields.Number(
            name = 'age'
        )
        
        confirmedEmail = new Fields.Boolean(
            name = 'confirmedEmail'
        )
        
        bornDate = new Fields.Moment(
            name = 'bornDate'
        )
        
        complexData = new Fields.Dictionary(
            name = 'complexData'
        )
        
    }
    
    let ogre = new Ogre(driver, [HumanSchema])

    
    let humanSchema = new HumanSchema()
    
    let human = humanSchema.instantiate()
    
    
    
    
    
    
    t.equal('test', 'test')
})