import * as test from 'tape'
import Ogre from '../src/ogre'
import Operators from '../src/ogre'
import Model from '../src/model'
import Schema from '../src/schema'
import * as cypher from '../src/cypher'
import {Predicate, Relation, Directions} from '../src/ogre'

const neoURL = "http://localhost:32810"
const neoUser =  "neo4j"
const neoPass = "neo4j1"

let UserSchema = new Schema('User', {
    id: Number,
    name: String,
    email: String,
    registered: Date,
    isAlive: Boolean,
    age: Number,
    colors: [String],
    numbers: [Number],
    bools: [Boolean],
    json: JSON,
    roles: new Relation('Role', 'is')
})

let RoleSchema = new Schema('Role', {
    id: Number,
    description: String,
    users: new Relation('User', 'is')
})

let ogre = new Ogre(neoURL, neoUser, neoPass, [UserSchema, RoleSchema])

test('prepare', async (t) => {
    t.plan(1)

    let ogre = new Ogre(neoURL, neoUser, neoPass)

    try {
        let result = await ogre.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')
        t.pass(`Wiped db from ${neoURL} in preparation for tests.`)
    } catch (e) {
        console.error(e)
    } finally {
        t.end()
    }
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

    t.plan(12)

    let User = new Model(UserSchema)
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

    let userData = {
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
    
    let u = await User.save(userData)
    u = await User.findById(u.id)
    t.equal(u.name, name, 'Should save string fields')
    t.equal(u.email, email, 'Should save string fields')
    t.deepEqual(u.registered, date, 'Should save date fields')
    t.equal(u.isAlive, isAlive, 'Should save boolean fields')
    t.equal(u.age, age, 'Should save number fields')
    t.deepEqual(u.colors, colors, 'Should save string arrays')
    t.deepEqual(u.numbers, numbers, 'Should save number arrays')
    t.deepEqual(u.bools, bools, 'Should save boolean arrays')
    t.deepEqual(u.json, json, 'Should save json objects')

    let id = u.id
    await User.remove(id)
    try {
        await User.findById(id)
    } catch (e) {
        t.pass('Should soft-remove nodes')
        await User.hardRemove(id)
    }

    u = await User.save(userData)
    await User.hardRemove(u.id)
    try {
        await User.findById(u.id)
    } catch (e) {
        t.pass('Should hard-remove nodes')
    }

    await User.save(userData)
    await User.save(userData)
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

    let users = await User.findByExample(predicates)
    t.equal(2, users.length, 'Should get nodes by predicates')

    let Role = new Model(RoleSchema)
    let roleData = {}
    roleData['description'] = 'Master Admin'
    let role = await Role.save(roleData)
    await Role.saveRelation('users', users[0], role)
    // await User.hardRemove(users[1].id)
    // await Role.hardRemove(role['id'])

})