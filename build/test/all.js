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
test('cypher lib test', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(4);
    t.equal(cypher.matchLabel('n', 'User'), 'match (n:User)', 'Should generate match query');
    t.equal(cypher.whereId('n', 3), 'where id(n)=3', 'Should generate where id equals query');
    t.equal(cypher.returnNode('n'), 'return n', 'Should generate return query');
    t.equal(cypher.queryByLabelAndId('User', 3), 'match (n:User) where id(n)=3 return n', 'Should generate query by label and id query');
}));
test('integration test', (t) => __awaiter(this, void 0, void 0, function* () {
    t.plan(7);
    let userSchema = new schema_1.default('User', {
        id: Number,
        name: String,
        email: String,
        registered: Date,
        isAlive: Boolean,
        age: Number
    });
    let ogre = new ogre_1.default("http://localhost:7474", "neo4j", "neo4j1", [userSchema]);
    let user = new model_1.default(userSchema);
    let name = 'dragos';
    let email = 'dragos.bulugean@gmail.com';
    let date = new Date();
    let isAlive = true;
    let age = 33;
    user.setBulk({
        name: name,
        email: email,
        registered: date,
        isAlive: true,
        age: age
    });
    let u = yield user.save();
    let v = yield user.findById(u['id']);
    t.equal(v['name'], name, 'Should save string fields');
    t.equal(v['email'], email, 'Should save string fields');
    t.equal(v['registered'].getTime(), date.getTime(), 'Should save date fields');
    t.equal(v['isAlive'], isAlive, 'Should save boolean fields');
    t.equal(v['age'], age, 'Should save number fields');
    yield user.remove();
    try {
        yield user.findById(u['id']);
    }
    catch (e) {
        t.equal(1, 1, 'Should soft-remove nodes');
        yield user.hardRemove(u['id']);
    }
    delete user.data.id;
    u = yield user.save();
    yield user.hardRemove();
    try {
        yield user.findById(u['id']);
    }
    catch (e) {
        t.equal(2, 2, 'Should hard-remove nodes');
    }
    t.end();
}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9hbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsTUFBWSxJQUFJLFdBQU0sTUFDdEIsQ0FBQyxDQUQyQjtBQUM1Qix1QkFBaUIsYUFDakIsQ0FBQyxDQUQ2QjtBQUM5Qix3QkFBa0IsY0FDbEIsQ0FBQyxDQUQrQjtBQUNoQyx5QkFBbUIsZUFDbkIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLE1BQU0sV0FBTSxlQUV4QixDQUFDLENBRnNDO0FBRXZDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFPLENBQUM7SUFDNUIsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNULENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQTtJQUN4RixDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLGVBQWUsRUFBRSx1Q0FBdUMsQ0FBQyxDQUFBO0lBQ3pGLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsOEJBQThCLENBQUMsQ0FBQTtJQUMzRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsdUNBQXVDLEVBQUUsNkNBQTZDLENBQUMsQ0FBQTtBQUV4SSxDQUFDLENBQUEsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLGtCQUFrQixFQUFFLENBQU8sQ0FBQztJQUU3QixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRVQsSUFBSSxVQUFVLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE1BQU0sRUFBRTtRQUNoQyxFQUFFLEVBQUUsTUFBTTtRQUNWLElBQUksRUFBRSxNQUFNO1FBQ1osS0FBSyxFQUFFLE1BQU07UUFDYixVQUFVLEVBQUUsSUFBSTtRQUNoQixPQUFPLEVBQUUsT0FBTztRQUNoQixHQUFHLEVBQUUsTUFBTTtLQUNkLENBQUMsQ0FBQTtJQUVGLElBQUksSUFBSSxHQUFHLElBQUksY0FBSSxDQUFDLHVCQUF1QixFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFBO0lBRTdFLElBQUksSUFBSSxHQUFHLElBQUksZUFBSyxDQUFDLFVBQVUsQ0FBQyxDQUFBO0lBQ2hDLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQTtJQUNuQixJQUFJLEtBQUssR0FBRywyQkFBMkIsQ0FBQTtJQUN2QyxJQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQTtJQUNsQixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUE7SUFFWixJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ1QsSUFBSSxFQUFFLElBQUk7UUFDVixLQUFLLEVBQUUsS0FBSztRQUNaLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsR0FBRyxFQUFFLEdBQUc7S0FDWCxDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUN6QixJQUFJLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDcEMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLDJCQUEyQixDQUFDLENBQUE7SUFDckQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsS0FBSyxFQUFFLDJCQUEyQixDQUFDLENBQUE7SUFDdkQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLHlCQUF5QixDQUFDLENBQUE7SUFDN0UsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixDQUFDLENBQUE7SUFDNUQsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxFQUFFLDJCQUEyQixDQUFDLENBQUE7SUFFbkQsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7SUFDbkIsSUFBSSxDQUFDO1FBQ0QsTUFBTSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ2hDLENBQUU7SUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUE7UUFDekMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO0lBQ25CLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQTtJQUNyQixNQUFNLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQTtJQUN2QixJQUFJLENBQUM7UUFDRCxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDaEMsQ0FBRTtJQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsMEJBQTBCLENBQUMsQ0FBQTtJQUM3QyxDQUFDO0lBRUQsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ1gsQ0FBQyxDQUFBLENBQUMsQ0FBQSJ9