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
const ogre_2 = require('../src/ogre');
const neoURL = "http://localhost:32810";
const neoUser = "neo4j";
const neoPass = "neo4j1";
let UserSchema = new schema_1.default('User', {
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
    roles: new ogre_2.Relation('Role', 'is')
});
let RoleSchema = new schema_1.default('Role', {
    id: Number,
    description: String,
    users: new ogre_2.Relation('User', 'is')
});
let ogre = new ogre_1.default(neoURL, neoUser, neoPass, [UserSchema, RoleSchema]);
test('prepare', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(1);
    let ogre = new ogre_1.default(neoURL, neoUser, neoPass);
    try {
        let result = yield ogre.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r');
        t.pass(`Wiped db from ${neoURL} in preparation for tests.`);
    }
    catch (e) {
        console.error(e);
    }
    finally {
        t.end();
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
    t.plan(12);
    let User = new model_1.default(UserSchema);
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
    };
    let u = yield User.save(userData);
    u = yield User.findById(u.id);
    t.equal(u.name, name, 'Should save string fields');
    t.equal(u.email, email, 'Should save string fields');
    t.deepEqual(u.registered, date, 'Should save date fields');
    t.equal(u.isAlive, isAlive, 'Should save boolean fields');
    t.equal(u.age, age, 'Should save number fields');
    t.deepEqual(u.colors, colors, 'Should save string arrays');
    t.deepEqual(u.numbers, numbers, 'Should save number arrays');
    t.deepEqual(u.bools, bools, 'Should save boolean arrays');
    t.deepEqual(u.json, json, 'Should save json objects');
    let id = u.id;
    yield User.remove(id);
    try {
        yield User.findById(id);
    }
    catch (e) {
        t.pass('Should soft-remove nodes');
        yield User.hardRemove(id);
    }
    u = yield User.save(userData);
    yield User.hardRemove(u.id);
    try {
        yield User.findById(u.id);
    }
    catch (e) {
        t.pass('Should hard-remove nodes');
    }
    yield User.save(userData);
    yield User.save(userData);
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
    let users = yield User.findByExample(predicates);
    t.equal(2, users.length, 'Should get nodes by predicates');
    let Role = new model_1.default(RoleSchema);
    let roleData = {};
    roleData['description'] = 'Master Admin';
    let role = yield Role.save(roleData);
    yield Role.saveRelation('users', users[0], role);
    // await User.hardRemove(users[1].id)
    // await Role.hardRemove(role['id'])
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1Qix1QkFBaUIsYUFDakIsQ0FBQyxDQUQ2QjtBQUU5Qix3QkFBa0IsY0FDbEIsQ0FBQyxDQUQrQjtBQUNoQyx5QkFBbUIsZUFDbkIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLE1BQU0sV0FBTSxlQUN4QixDQUFDLENBRHNDO0FBQ3ZDLHVCQUE4QyxhQUU5QyxDQUFDLENBRjBEO0FBRTNELE1BQU0sTUFBTSxHQUFHLHdCQUF3QixDQUFBO0FBQ3ZDLE1BQU0sT0FBTyxHQUFJLE9BQU8sQ0FBQTtBQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUE7QUFFeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRTtJQUNoQyxFQUFFLEVBQUUsTUFBTTtJQUNWLElBQUksRUFBRSxNQUFNO0lBQ1osS0FBSyxFQUFFLE1BQU07SUFDYixVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsT0FBTztJQUNoQixHQUFHLEVBQUUsTUFBTTtJQUNYLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNoQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakIsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2hCLElBQUksRUFBRSxJQUFJO0lBQ1YsS0FBSyxFQUFFLElBQUksZUFBUSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUM7Q0FDcEMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRTtJQUNoQyxFQUFFLEVBQUUsTUFBTTtJQUNWLFdBQVcsRUFBRSxNQUFNO0lBQ25CLEtBQUssRUFBRSxJQUFJLGVBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDO0NBQ3BDLENBQUMsQ0FB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QUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSw0QkFBNEIsQ0FBQyxDQUFBO0lBQ3pELENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUNoRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLDJCQUEyQixDQUFDLENBQUE7SUFDMUQsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsQ0FBQyxDQUFBO0lBQzVELENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQTtJQUN6RCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLDBCQUEwQixDQUFDLENBQUE7SUFFckQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtJQUNiLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNyQixJQUFJLENBQUM7UUFDRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDM0IsQ0FBRTtJQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUE7UUFDbEMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQzdCLENBQUM7SUFFRCxDQUFDLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzdCLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDM0IsSUFBSSxDQUFDO1FBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUM3QixDQUFFO0lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLENBQUMsQ0FBQTtJQUN0QyxDQUFDO0lBRUQsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQ3pCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN6QixJQUFJLFVBQVUsR0FBZ0I7UUFDMUI7WUFDSSxLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLE1BQU07WUFDYixZQUFZLEVBQUUsS0FBSztTQUN0QjtRQUNEO1lBQ0ksS0FBSyxFQUFFLE9BQU87WUFDZCxRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxnQkFBZ0I7U0FDMUI7S0FDSixDQUFBO0lBRUQsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsZ0NBQWdDLENBQUMsQ0FBQTtJQUUxRCxJQUFJLElBQUksR0FBRyxJQUFJLGVBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNoQyxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUE7SUFDakIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLGNBQWMsQ0FBQTtJQUN4QyxJQUFJLElBQUksR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDcEMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUE7SUFDaEQscUNBQXFDO0lBQ3JDLG9DQUFvQztBQUV4QyxDQUFDLENBQUEsQ0FBQyxDQUFBIn0=