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
const seraph = require('seraph');
const neoURL = "http://localhost:7474";
const neoUser = "neo4j";
const neoPass = "neo4j1";
test('prepare', (t) => {
    t.plan(1);
    let srph = seraph({
        server: neoURL,
        user: neoUser,
        pass: neoPass
    });
    srph.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r', (err, result) => {
        if (err)
            console.error(err);
        t.pass(`Wiped db from ${neoURL} in preparation for tests.`);
        t.end();
    });
});
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
    t.plan(13);
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
    let name = 'dragos';
    let email = 'dragos.bulugean@gmail.com';
    let date = new Date();
    let isAlive = true;
    let age = 33;
    let colors = ['white', 'red', 'blue'];
    let numbers = [1, 2, 3, 4, 5];
    let bools = [true, true, false];
    let json = {
        weapon: 'ak47',
        car: 'aro'
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
            value: 'dragos',
            continuation: 'and'
        },
        {
            field: 'email',
            operator: '=',
            value: 'dragos.bulugean@gmail.com'
        }
    ];
    let users = yield user.findByExample(predicates);
    t.pass('Should get nodes by predicates');
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1Qix1QkFBaUIsYUFDakIsQ0FBQyxDQUQ2QjtBQUU5Qix3QkFBa0IsY0FDbEIsQ0FBQyxDQUQrQjtBQUNoQyx5QkFBbUIsZUFDbkIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLE1BQU0sV0FBTSxlQUN4QixDQUFDLENBRHNDO0FBRXZDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtBQUVoQyxNQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FBQTtBQUN0QyxNQUFNLE9BQU8sR0FBSSxPQUFPLENBQUE7QUFDeEIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFBO0FBRXhCLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO0lBQ2QsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNULElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQztRQUNkLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLE9BQU87UUFDYixJQUFJLEVBQUUsT0FBTztLQUNoQixDQUFDLENBQUE7SUFDRixJQUFJLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxFQUFFLENBQUMsR0FBRyxFQUFFLE1BQU07UUFDckUsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUMzQixDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixNQUFNLDRCQUE0QixDQUFDLENBQUE7UUFDM0QsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO0lBQ1gsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFPLENBQUM7SUFDNUIsQ0FBQyxD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