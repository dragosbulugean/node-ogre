"use strict";
const test = require('tape');
const ogre_1 = require('../src/ogre');
const schema_1 = require('../src/schema');
const Fields = require('../src/fields');
var neo4j = require('neo4j-driver');
test('timing test', function (t) {
    t.plan(1);
    let driver = neo4j.v1.driver("bolt://localhost", neo4j.v1.auth.basic("neo4j", "neo4j1"));
    class HumanSchema extends schema_1.default {
        constructor(...args) {
            super(...args);
            this.label = 'Human';
            this.firstName = new Fields.String(name = 'firstName');
            this.lastName = new Fields.String(name = 'lastName');
            this.age = new Fields.Number(name = 'age');
            this.confirmedEmail = new Fields.Boolean(name = 'confirmedEmail');
            this.bornDate = new Fields.Moment(name = 'bornDate');
            this.complexData = new Fields.Dictionary(name = 'complexData');
        }
    }
    let ogre = new ogre_1.default(driver, [HumanSchema]);
    let humanSchema = new HumanSchema();
    let human = humanSchema.instantiate();
    t.equal('test', 'test');
});
//# sourceMappingURL=all.js.map