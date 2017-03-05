"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var Bluebird = require("bluebird");
var seraph = require('seraph');
var Ogre = (function () {
    function Ogre(url, user, password, schemas) {
        var _this = this;
        this.url = url;
        this.user = user;
        this.password = password;
        this.seraph = seraph({
            server: this.url,
            user: this.user,
            pass: this.password
        });
        Bluebird.promisifyAll(this.seraph);
        this.schemas = schemas || [];
        this.schemas.forEach(function (model) {
            model.setSeraph(_this.seraph);
        });
        if (!_.isEmpty(this.schemas))
            this.checkSchemas(this.schemas);
    }
    Ogre.prototype.checkSchemas = function (schemas) {
        var schemaMap = {};
        schemas.forEach(function (schema) {
            var label = schema.label;
            schemaMap[label] = schema;
        });
        var allRelations = [];
        schemas.forEach(function (schema) {
            for (var key in schema.fields) {
                if (_.has(schema.fields, key)) {
                    var field = schema.fields[key];
                    if (field instanceof Relation)
                        allRelations.push(field);
                }
            }
        });
        allRelations.forEach(function (rel) {
            if (!_.has(schemaMap, rel.toSchemaString))
                throw new Error(rel.toSchemaString + " was not found in your schema definitions.");
            else
                rel.setToSchema(schemaMap[rel.toSchemaString]);
        });
        // for (let schemaKey in schemaMap) {
        //     let schema = schemaMap[schemaKey]
        //     for (let fieldKey in schema.fields) {
        //         let field = schema.fields[fieldKey]
        //         if(field instanceof Relation) {
        //         } 
        //     }
        // }
    };
    Ogre.prototype.query = function (query) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.seraph.queryAsync(query)
                .then(function (response) {
                return resolve(response);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    return Ogre;
}());
exports.default = Ogre;
exports.Direction = {
    in: '<',
    out: '>',
    inOut: '<>'
};
var Relation = (function () {
    function Relation(toSchemaString, type, direction) {
        this.toSchemaString = toSchemaString;
        this.type = type;
        var dir = exports.Direction.out;
        if (direction && _.includes(_.toArray(exports.Direction), direction))
            dir = direction;
        this.direction = dir;
    }
    Relation.prototype.setToSchema = function (toSchema) {
        this.toSchema = toSchema;
    };
    return Relation;
}());
exports.Relation = Relation;
// Left here for documentation purposes
exports.Operators = {
    'and': 'AND',
    'or': 'OR',
    'in': 'IN',
    'eq': '=',
    'neq': '<>',
    'gt': '>',
    'lt': '<',
    'gte': '>=',
    'lte': '<=',
    'regex': '=~',
    'n': 'IS NULL',
    'nn': 'IS NOT NULL'
};
//# sourceMappingURL=ogre.js.map