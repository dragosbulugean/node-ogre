"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t;
    return { next: verb(0), "throw": verb(1), "return": verb(2) };
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var test = require("tape");
var ogre_1 = require("../src/ogre");
var model_1 = require("../src/model");
var schema_1 = require("../src/schema");
var cypher = require("../src/cypher");
var ogre_2 = require("../src/ogre");
var neoURL = 'http://localhost:7474';
var neoUser = 'neo4j';
var neoPass = 'neo4j1';
var UserSchema = new schema_1.default('User', {
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
var RoleSchema = new schema_1.default('Role', {
    id: Number,
    description: String,
    users: new ogre_2.Relation('User', 'is')
});
test('prepare', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var ogre, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t.plan(1);
                ogre = new ogre_1.default(neoURL, neoUser, neoPass, [UserSchema, RoleSchema]);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, 4, 5]);
                return [4 /*yield*/, ogre.query('MATCH (n) OPTIONAL MATCH (n)-[r]-() DELETE n,r')];
            case 2:
                _a.sent();
                t.pass("Wiped db from " + neoURL + " in preparation for tests.");
                return [3 /*break*/, 5];
            case 3:
                e_1 = _a.sent();
                console.error(e_1);
                return [3 /*break*/, 5];
            case 4:
                t.end();
                return [7 /*endfinally*/];
            case 5: return [2 /*return*/];
        }
    });
}); });
test('cypher lib test', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var predicates, query;
    return __generator(this, function (_a) {
        t.plan(7);
        t.equal(cypher.matchLabel('n', 'User'), 'match (n:User)', 'Should generate match query');
        t.equal(cypher.whereId('n', 3), 'where id(n)=3', 'Should generate where id equals query');
        t.equal(cypher.returnNode('n'), 'return n', 'Should generate return query');
        t.equal(cypher.returnCount('n'), 'return count(n)', 'Should generate return count query');
        t.equal(cypher.queryByLabelAndId('User', 3), 'match (n:User) where id(n)=3 return n', 'Should generate query by label and id query');
        t.equal(cypher.queryCount('User'), 'match (n:User) return count(n)', 'Should generate query count by label');
        predicates = [
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
        query = cypher.queryFromPredicates('User', predicates);
        t.equal(query, 'match (n:User) where n.name="dragos" and n.age=4 return n', 'Should generate query for multiple predicates');
        return [2 /*return*/];
    });
}); });
test('integration test', function (t) { return __awaiter(_this, void 0, void 0, function () {
    var User, name, email, date, isAlive, age, colors, numbers, bools, json, userData, u, id, e_2, e_3, predicates, users, Role, roleData, role;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                t.plan(12);
                User = new model_1.default(UserSchema);
                name = 'maya';
                email = 'maya@gmail.com';
                date = new Date();
                isAlive = true;
                age = 33;
                colors = ['white', 'red', 'blue'];
                numbers = [1, 2, 3, 4, 5];
                bools = [true, true, false];
                json = {
                    tires: '25inch',
                    cartype: '4x4'
                };
                userData = {
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
                return [4 /*yield*/, User.save(userData)];
            case 1:
                u = _a.sent();
                return [4 /*yield*/, User.findById(u.id)];
            case 2:
                u = _a.sent();
                t.equal(u.name, name, 'Should save string fields');
                t.equal(u.email, email, 'Should save string fields');
                t.deepEqual(u.registered, date, 'Should save date fields');
                t.equal(u.isAlive, isAlive, 'Should save boolean fields');
                t.equal(u.age, age, 'Should save number fields');
                t.deepEqual(u.colors, colors, 'Should save string arrays');
                t.deepEqual(u.numbers, numbers, 'Should save number arrays');
                t.deepEqual(u.bools, bools, 'Should save boolean arrays');
                t.deepEqual(u.json, json, 'Should save json objects');
                id = u.id;
                return [4 /*yield*/, User.remove(id)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _a.trys.push([4, 6, , 8]);
                return [4 /*yield*/, User.findById(id)];
            case 5:
                _a.sent();
                return [3 /*break*/, 8];
            case 6:
                e_2 = _a.sent();
                t.pass('Should soft-remove nodes');
                return [4 /*yield*/, User.hardRemove(id)];
            case 7:
                _a.sent();
                return [3 /*break*/, 8];
            case 8: return [4 /*yield*/, User.save(userData)];
            case 9:
                u = _a.sent();
                return [4 /*yield*/, User.hardRemove(u.id)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11:
                _a.trys.push([11, 13, , 14]);
                return [4 /*yield*/, User.findById(u.id)];
            case 12:
                _a.sent();
                return [3 /*break*/, 14];
            case 13:
                e_3 = _a.sent();
                t.pass('Should hard-remove nodes');
                return [3 /*break*/, 14];
            case 14: return [4 /*yield*/, User.save(userData)];
            case 15:
                _a.sent();
                return [4 /*yield*/, User.save(userData)];
            case 16:
                _a.sent();
                predicates = [
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
                return [4 /*yield*/, User.findByExample(predicates)];
            case 17:
                users = _a.sent();
                t.equal(2, users.length, 'Should get nodes by predicates');
                Role = new model_1.default(RoleSchema);
                roleData = {};
                roleData['description'] = 'Master Admin';
                return [4 /*yield*/, Role.save(roleData)];
            case 18:
                role = _a.sent();
                return [4 /*yield*/, Role.saveRelation('users', users[0], role)
                    // await User.hardRemove(users[1].id)
                    // await Role.hardRemove(role['id'])
                ];
            case 19:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=all.js.map