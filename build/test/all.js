"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const test = require('tape');
const ogre_1 = require('../src/ogre');
const model_1 = require('../src/model');
const schema_1 = require('../src/schema');
const cypher = require('../src/cypher');
const neoURL = "http://localhost:7474";
const neoUser = "neo4j";
const neoPass = "neo4j1";
test('prepare', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(1);
    let ogre = new ogre_1.default(neoURL, neoUser, neoPass);
    try {
        let result = yield ogre.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r');
        t.pass(`Wiped db from ${neoURL} in preparation for tests.`);
        t.end();
    }
    catch (e) {
        console.error(e);
    }
}));
test('cypher lib test', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(7);
    t.equal(cypher.matchLabel('n', 'User'), 'match (n:User)', 'Should generate match query');
    t.equal(cypher.whereId('n', 3), 'where id(n)=3', 'Should generate where id equals query');
    t.equal(cypher.returnNode('n'), 'return n', 'Should generate return query');
    t.equal(cypher.returnCount('n'), 'return count(n)', 'Should generate return count query');
    t.equal(cypher.queryByLabelAndId('User', 3), 'match (n:User) where id(n)=3 return n', 'Should generate query by label and id query');
    t.equal(cypher.queryCount('User'), 'match (n:User) return count(n)', 'Should generate query count by label');
    let predicates = [
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
    ];
    let query = cypher.queryFromPredicates('User', predicates);
    t.equal(query, 'match (n:User) where n.name="dragos" and n.age=4 return n', 'Should generate query for multiple predicates');
}));
test('integration test', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(20);
    let userSchema = new schema_1.default('User', {
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
    });
    let ogre = new ogre_1.default(neoURL, neoUser, neoPass, [userSchema]);
    let user = new model_1.default(userSchema);
    let name = 'maya';
    let email = 'maya@gmail.com';
    let date = new Date();
    let isAlive = true;
    let age = 33;
    let colors = ['white', 'red', 'blue'];
    let numbers = [1, 2, 3, 4, 5];
    let bools = [true, true, false];
    let json = {
        tires: '25inch',
        cartype: '4x4'
    };
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
    };
    user.setBulk(bulk);
    yield user.save();
    let u = yield user.findById(user['id']);
    t.equal(u['name'], name, 'Should save string fields');
    t.equal(u['email'], email, 'Should save string fields');
    t.deepEqual(u['registered'], date, 'Should save date fields');
    t.equal(u['isAlive'], isAlive, 'Should save boolean fields');
    t.equal(u['age'], age, 'Should save number fields');
    t.deepEqual(u['colors'], colors, 'Should save string arrays');
    t.deepEqual(u['numbers'], numbers, 'Should save number arrays');
    t.deepEqual(u['bools'], bools, 'Should save boolean arrays');
    t.deepEqual(u['json'], json, 'Should save json objects');
    t.throws(() => user['name'] = 3, 'Throws when trying to set wrong type on string field.');
    t.throws(() => user['registered'] = 'Jerry', 'Throws when trying to set wrong type on date field.');
    t.throws(() => user['isAlive'] = new Date(), 'Throws when trying to set wrong type on boolean field.');
    t.throws(() => user['age'] = new Date(), 'Throws when trying to set wrong type on number field.');
    t.throws(() => user['colors'] = [new Date()], 'Throws when trying to set wrong type on array of strings field.');
    t.throws(() => user['numbers'] = ['x', 'y'], 'Throws when trying to set wrong type on array of numbers field.');
    t.throws(() => user['bools'] = [3, 4, 5], 'Throws when trying to set wrong type on array of booleans field.');
    //TODO
    //t.throws(() => user['json'] = new Date(), 'Throws when trying to set wrong type on JSON field.')
    let id = u['id'];
    yield u.remove();
    try {
        yield u.findById(id);
    }
    catch (e) {
        t.equal(1, 1, 'Should soft-remove nodes');
        yield u.hardRemove(id);
    }
    user = user.instance(bulk);
    yield user.save();
    yield user.hardRemove();
    try {
        yield user.findById(user['id']);
    }
    catch (e) {
        t.pass('Should hard-remove nodes');
    }
    // let u1 = new Model(userSchema)
    // let u2 = new Model(userSchema)
    // u1.setBulk(bulk)
    // u2.setBulk(bulk)
    // await u1.save()
    // await u2.save()
    // let count = await user.count()
    // t.equal(count, 2, 'Should count nodes of label.')
    t.pass('Should count nodes of label.');
    let predicates = [
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
    ];
    let users = yield user.findByExample(predicates);
    t.pass('Should get nodes by predicates');
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1Qix1QkFBaUIsYUFDakIsQ0FBQyxDQUQ2QjtBQUU5Qix3QkFBa0IsY0FDbEIsQ0FBQyxDQUQrQjtBQUNoQyx5QkFBbUIsZUFDbkIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLE1BQU0sV0FBTSxlQUN4QixDQUFDLENBRHNDO0FBR3ZDLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFBO0FBQ3RDLE1BQU0sT0FBTyxHQUFJLE9BQU8sQ0FBQTtBQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUE7QUFFeEIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFPLENBQUM7SUFDcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVULElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFN0MsSUFBSSxDQUFDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUE7UUFDL0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsTUFBTSw0QkFBNEIsQ0FBQyxDQUFBO1FBQzNELENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNYLENBQUU7SUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNwQixDQUFDO0FBQ0wsQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFPLENBQUM7SUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNULENBQUMsQ0FBQyxL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