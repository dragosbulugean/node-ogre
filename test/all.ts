import * as test from 'tape'
import Ogre from '../src/ogre'
import Model from '../src/model'
import Schema from '../src/schema'
import * as cypher from '../src/cypher'

test('cypher lib test', async (t) => {
    t.plan(4)
    t.equal(cypher.matchLabel('n', 'User'), 'match (n:User)', 'Should generate match query')
    t.equal(cypher.whereId('n', 3), 'where id(n)=3', 'Should generate where id equals query')
    t.equal(cypher.returnNode('n'), 'return n', 'Should generate return query')
    t.equal(cypher.queryByLabelAndId('User', 3), 'match (n:User) where id(n)=3 return n', 'Should generate query by label and id query')

})

test('integration test', async (t) => {

    t.plan(7)

    let userSchema = new Schema('User', {
        id: Number,
        name: String,
        email: String,
        registered: Date,
        isAlive: Boolean,
        age: Number
    })

    let ogre = new Ogre("http://localhost:7474", "neo4j", "neo4j1", [userSchema])

    let user = new Model(userSchema)
    let name = 'dragos'
    let email = 'dragos.bulugean@gmail.com'
    let date = new Date()
    let isAlive = true
    let age = 33
    
    user.setBulk({
        name: name,
        email: email,
        registered: date,
        isAlive: true,
        age: age
    })

    let u = await user.save()
    let v = await user.findById(u['id'])
    t.equal(v['name'], name, 'Should save string fields')
    t.equal(v['email'], email, 'Should save string fields')
    t.equal(v['registered'].getTime(), date.getTime(), 'Should save date fields')
    t.equal(v['isAlive'], isAlive, 'Should save boolean fields')
    t.equal(v['age'], age, 'Should save number fields')

    await user.remove()
    try {
        await user.findById(u['id'])
    } catch (e) {
        t.equal(1, 1, 'Should soft-remove nodes')
        await user.hardRemove(u['id'])
    }

    delete user.data.id
    u = await user.save()
    await user.hardRemove()
    try {
        await user.findById(u['id'])
    } catch (e) {
        t.equal(2, 2, 'Should hard-remove nodes')
    }

    t.end()
})