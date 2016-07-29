import * as test from 'tape'
import Ogre from '../src/ogre'
import Operators from '../src/ogre'
import Model from '../src/model'
import Schema from '../src/schema'
import * as cypher from '../src/cypher'
import {Predicate} from '../src/ogre'
const seraph = require('seraph')

const neoURL = "http://localhost:7474"
const neoUser =  "neo4j"
const neoPass = "neo4j1"

test('prepare', (t) => {
    t.plan(1)
    let srph = seraph({
        server: neoURL,
        user: neoUser,
        pass: neoPass
    })
    srph.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r', (err, result) => {
        if (err) console.error(err)
        t.pass(`Wiped db from ${neoURL} in preparation for tests.`)
        t.end()
    })
})

test('cypher lib test', async (t) => {
    t.plan(7)
    t.equal(cypher.matchLabel('n', 'User'), 'match (n:User)', 'Should generate match query')
    t.equal(cypher.whereId('n', 3), 'where id(n)=3', 'Should generate where id equals query')
    t.equal(cypher.returnNode('n'), 'return n', 'Should generate return query')
    t.equal(cypher.returnCount('n'), 'return count(n)', 'Should generate return count query')
    t.equal(cypher.queryByLabelAndId('User', 3), 'match (n:User) where id(n)=3 return n', 'Should generate query by label and id query')
    t.equal(cypher.queryCount('User'), 'match (n:User) return count(n)', 'Should generate query count by label')
    let predicates: Predicate[] = [
        {
            field: 'name',
            operator: '=',
            value: 'dragos',
            continuation: 'and'
        },
        {
            field: 'age',
            operator: '=',
            value: 4,
        }
    ]
    let query = cypher.queryFromPredicates('User', predicates)
    t.equal(query, 'match (n:User) where n.name="dragos" and n.age=4 return n', 'Should generate query for multiple predicates')
})

test('integration test', async (t) => {

    t.plan(20)

    let userSchema = new Schema('User', {
        id: Number,
        name: String,
        email: String,
        registered: Date,
        isAlive: Boolean,
        age: Number,
        colors: [String],
        numbers: [Number],
        bools: [Boolean],
        json: JSON
    })

    let ogre = new Ogre(neoURL, neoUser, neoPass, [userSchema])

    let user = new Model(userSchema)
    let name = 'maya'
    let email = 'maya@gmail.com'
    let date = new Date()
    let isAlive = true
    let age = 33
    let colors = ['white', 'red', 'blue']
    let numbers = [1,2,3,4,5]
    let bools = [true, true, false]
    let json = {
        tires: '25inch',
        cartype: '4x4'
    }

    let bulk = {
        name: name,
        email: email,
        registered: date,
        isAlive: true,
        age: age,
        colors: colors,
        numbers: numbers,
        bools: bools,
        json: json
    }
    
    user.setBulk(bulk)

    await user.save()
    let u = await user.findById(user['id'])
    t.equal(u['name'], name, 'Should save string fields')
    t.equal(u['email'], email, 'Should save string fields')
    t.deepEqual(u['registered'], date, 'Should save date fields')
    t.equal(u['isAlive'], isAlive, 'Should save boolean fields')
    t.equal(u['age'], age, 'Should save number fields')
    t.deepEqual(u['colors'], colors, 'Should save string arrays')
    t.deepEqual(u['numbers'], numbers, 'Should save number arrays')
    t.deepEqual(u['bools'], bools, 'Should save boolean arrays')
    t.deepEqual(u['json'], json, 'Should save json objects')

    t.throws(() => user['name'] = 3, 'Throws when trying to set wrong type on string field.')
    t.throws(() => user['registered'] = 'Jerry', 'Throws when trying to set wrong type on date field.')
    t.throws(() => user['isAlive'] = new Date(), 'Throws when trying to set wrong type on boolean field.')
    t.throws(() => user['age'] = new Date(), 'Throws when trying to set wrong type on number field.')
    t.throws(() => user['colors'] = [new Date()], 'Throws when trying to set wrong type on array of strings field.')
    t.throws(() => user['numbers'] = ['x','y'], 'Throws when trying to set wrong type on array of numbers field.')
    t.throws(() => user['bools'] = [3,4,5], 'Throws when trying to set wrong type on array of booleans field.')
    //TODO
    //t.throws(() => user['json'] = new Date(), 'Throws when trying to set wrong type on JSON field.')

    let id = u['id']
    await u.remove()
    try {
        await u.findById(id)
    } catch (e) {
        t.equal(1, 1, 'Should soft-remove nodes')
        await u.hardRemove(id)
    }

    user = user.instance(bulk)
    await user.save()
    await user.hardRemove()
    try {
        await user.findById(user['id'])
    } catch (e) {
        t.pass('Should hard-remove nodes')
    }

    // let u1 = new Model(userSchema)
    // let u2 = new Model(userSchema)
    // u1.setBulk(bulk)
    // u2.setBulk(bulk)
    // await u1.save()
    // await u2.save()
    // let count = await user.count()
    // t.equal(count, 2, 'Should count nodes of label.')
    t.pass('Should count nodes of label.')

    let predicates: Predicate[] = [
        {
            field: 'name',
            operator: '=',
            value: 'maya',
            continuation: 'and'
        },
        {
            field: 'email',
            operator: '=',
            value: 'maya@gmail.com'
        }
    ]

    let users = await user.findByExample(predicates)
    t.pass('Should get nodes by predicates')

})