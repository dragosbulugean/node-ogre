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
const neoURL = "http://localhost:7474";
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
    roles: new ogre_2.Relation('Role', 'has')
});
let RoleSchema = new schema_1.default('Role', {
    id: Number,
    description: String,
    users: new ogre_2.Relation('User', 'has')
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
    t.plan(20);
    let user = new model_1.default(UserSchema);
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
    user = new model_1.default(UserSchema);
    user.setBulk(bulk);
    yield user.save();
    let role = new model_1.default(RoleSchema);
    role['description'] = 'Master Admin';
    yield role.save();
    yield role.saveRelation('users', user);
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1Qix1QkFBaUIsYUFDakIsQ0FBQyxDQUQ2QjtBQUU5Qix3QkFBa0IsY0FDbEIsQ0FBQyxDQUQrQjtBQUNoQyx5QkFBbUIsZUFDbkIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLE1BQU0sV0FBTSxlQUN4QixDQUFDLENBRHNDO0FBQ3ZDLHVCQUFrQyxhQUVsQyxDQUFDLENBRjhDO0FBRS9DLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFBO0FBQ3RDLE1BQU0sT0FBTyxHQUFJLE9BQU8sQ0FBQTtBQUN4QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUE7QUFFeEIsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRTtJQUNoQyxFQUFFLEVBQUUsTUFBTTtJQUNWLElBQUksRUFBRSxNQUFNO0lBQ1osS0FBSyxFQUFFLE1BQU07SUFDYixVQUFVLEVBQUUsSUFBSTtJQUNoQixPQUFPLEVBQUUsT0FBTztJQUNoQixHQUFHLEVBQUUsTUFBTTtJQUNYLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztJQUNoQixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDakIsS0FBSyxFQUFFLENBQUMsT0FBTyxDQUFDO0lBQ2hCLElBQUksRUFBRSxJQUFJO0lBQ1YsS0FBSyxFQUFFLElBQUksZUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUM7Q0FDckMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRTtJQUNoQyxFQUFFLEVBQUUsTUFBTTtJQUNWLFdBQVcsRUFBRSxNQUFNO0lBQ25CLEtBQUssRUFBRSxJQUFJLGVBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO0NBQ3JDLENBQUMsQ0FBQTtBQUVGLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUE7QUFFdkUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFPLENBQUM7SUFDcEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUVULElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFFN0MsSUFBSSxDQUFDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUE7UUFDL0UsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsTUFBTSw0QkFBNEIsQ0FBQyxDQUFBO0lBQy9ELENBQUU7SUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNwQixDQUFDO1lBQVMsQ0FBQztRQUNQLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQTtJQUNYLENBQUM7QUFDTCxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQU8sQ0FBQztJQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ1QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsRUFBRSw2QkFBNkIsQ0FBQyxDQUFBO0lBQ3hGLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLEVBQUUsZUFBZSxFQUFFLHVDQUF1QyxDQUFDLENBQUE7SUFDekYsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFBO0lBQzNFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsRUFBRSxpQkFBaUIsRUFBRSxvQ0FBb0MsQ0FBQyxDQUFBO0lBQ3pGLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSx1Q0FBdUMsRUFBRSw2Q0FBNkMsQ0FBQyxDQUFBO0lBQ3BJLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxnQ0FBZ0MsRUFBRSxzQ0FBc0MsQ0FBQyxDQUFBO0lBQzVHLElBQUksVUFBVSxHQUFnQjtRQUMxQjtZQUNJLEtBQUssRUFBRSxNQUFNO1lBQ2IsUUFBUSxFQUFFLEdBQUc7WUFDYixLQUFLLEVBQUUsUUFBUTtZQUNmLFlBQVksRUFBRSxLQUFLO1NBQ3RCO1FBQ0Q7WUFDSSxLQUFLLEVBQUUsS0FBSztZQUNaLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLENBQUM7U0FDWDtLQUNKLENBQUE7SUFDRCxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFBO0lBQzFELENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLDJEQUEyRCxFQUFFLCtDQUErQyxDQUFDLENBQUE7QUFDaEksQ0FBQyxDQUFBLENBQUMsQ0FBQTtBQUVGLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFPLENBQUM7SUFFN0IsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUVWLElBQUksSUFBSSxHQUFHLElBQUksZUFBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2hDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQTtJQUNqQixJQUFJLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQTtJQUM1QixJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7SUFDWixJQUFJLE1BQU0sR0FBRyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUE7SUFDckMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUE7SUFDekIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQy9CLElBQUksSUFBSSxHQUFHO1FBQ1AsS0FBSyxFQUFFLFFBQVE7UUFDZixPQUFPLEVBQUUsS0FBSztLQUNqQixDQUFBO0lBRUQsSUFBSSxJQUFJLEdBQUc7UUFDUCxJQUFJLEVBQUUsSUFBSTtRQUNWLEtBQUssRUFBRSxLQUFLO1FBQ1osVUFBVSxFQUFFLElBQUk7UUFDaEIsT0FBTyxFQUFFLElBQUk7UUFDYixHQUFHLEVBQUUsR0FBRztRQUNSLE1BQU0sRUFBRSxNQUFNO1FBQ2QsT0FBTyxFQUFFLE9BQU87UUFDaEIsS0FBSyxFQUFFLEtBQUs7UUFDWixJQUFJLEVBQUUsSUFBSTtLQUNiLENBQUE7SUFFRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBRWxCLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2pCLElBQUksQ0FBQyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtJQUN2QyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUNyRCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUN2RCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUseUJBQXlCLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsNEJBQTRCLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxHQUFHLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUNuRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLEVBQUUsMkJBQTJCLENBQUMsQ0FBQTtJQUMvRCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxLQUFLLEVBQUUsNEJBQTRCLENBQUMsQ0FBQTtJQUM1RCxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtJQUV4RCxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSx1REFBdUQsQ0FBQyxDQUFBO0lBQ3pGLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsT0FBTyxFQUFFLHFEQUFxRCxDQUFDLENBQUE7SUFDbkcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxFQUFFLHdEQUF3RCxDQUFDLENBQUE7SUFDdEcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxFQUFFLHVEQUF1RCxDQUFDLENBQUE7SUFDakcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLENBQUMsRUFBRSxpRUFBaUUsQ0FBQyxDQUFBO0lBQ2hILENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUMsR0FBRyxDQUFDLEVBQUUsaUVBQWlFLENBQUMsQ0FBQTtJQUM5RyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsRUFBRSxrRUFBa0UsQ0FBQyxDQUFBO0lBQzNHLE1BQU07SUFDTixrR0FBa0c7SUFFbEcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2hCLE1BQU0sQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFBO0lBQ2hCLElBQUksQ0FBQztRQUNELE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUN4QixDQUFFO0lBQUEsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSwwQkFBMEIsQ0FBQyxDQUFBO1FBQ3pDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBRUQsSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDMUIsTUFBTSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUE7SUFDakIsTUFBTSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDdkIsSUFBSSxDQUFDO1FBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ25DLENBQUU7SUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFBO0lBQ3RDLENBQUM7SUFFRCxpQ0FBaUM7SUFDakMsaUNBQWlDO0lBQ2pDLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsa0JBQWtCO0lBQ2xCLGtCQUFrQjtJQUNsQixpQ0FBaUM7SUFDakMsb0RBQW9EO0lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQUV0QyxJQUFJLFVBQVUsR0FBZ0I7UUFDMUI7WUFDSSxLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxHQUFHO1lBQ2IsS0FBSyxFQUFFLE1BQU07WUFDYixZQUFZLEVBQUUsS0FBSztTQUN0QjtRQUNEO1lBQ0ksS0FBSyxFQUFFLE9BQU87WUFDZCxRQUFRLEVBQUUsR0FBRztZQUNiLEtBQUssRUFBRSxnQkFBZ0I7U0FDMUI7S0FDSixDQUFBO0lBRUQsSUFBSSxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtJQUV4QyxJQUFJLEdBQUcsSUFBSSxlQUFLLENBQUMsVUFBVSxDQUFDLENBQUE7SUFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUNsQixNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLGVBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQTtJQUNoQyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsY0FBYyxDQUFBO0lBQ3BDLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBO0lBQ2pCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUE7QUFFMUMsQ0FBQyxDQUFBLENBQUMsQ0FBQSJ9