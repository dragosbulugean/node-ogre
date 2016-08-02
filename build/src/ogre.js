"use strict";
const _ = require('lodash');
const Bluebird = require('bluebird');
const seraph = require("seraph");
class Ogre {
    constructor(url, user, password, schemas) {
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
        this.schemas.forEach(model => {
            model.setSeraph(this.seraph);
        });
        if (!_.isEmpty(this.schemas))
            this.checkSchemas(this.schemas);
    }
    checkSchemas(schemas) {
        let schemaMap = {};
        schemas.forEach(schema => {
            let label = schema.label;
            schemaMap[label] = schema;
        });
        let allRelations = [];
        schemas.forEach(schema => {
            for (let key in schema.fields) {
                let field = schema.fields[key];
                if (field instanceof Relation)
                    allRelations.push(field);
            }
        });
        allRelations.forEach(rel => {
            if (!_.has(schemaMap, rel.toSchemaString))
                throw new Error(`${rel.toSchemaString} was not found in your schema definitions.`);
            else
                rel.setToSchema(schemaMap[rel.toSchemaString]);
        });
    }
    query(query) {
        return new Promise((resolve, reject) => {
            this.seraph.queryAsync(query)
                .then(response => {
                return resolve(response);
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ogre;
exports.Directions = {
    In: '<',
    Out: '>',
    InOut: '<>'
};
class Relation {
    constructor(toSchemaString, type, direction) {
        this.toSchemaString = toSchemaString;
        this.type = type;
        this.direction = direction || exports.Directions.InOut;
    }
    setToSchema(toSchema) {
        this.toSchema = toSchema;
    }
}
exports.Relation = Relation;
//Left here for documentation purposes
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2dyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vZ3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxNQUFZLENBQUMsV0FBTSxRQUNuQixDQUFDLENBRDBCO0FBQzNCLE1BQVksUUFBUSxXQUFNLFVBQzFCLENBQUMsQ0FEbUM7QUFDcEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0FBRWhDO0lBUUksWUFBWSxHQUFXLEVBQUUsSUFBWSxFQUFFLFFBQWdCLEVBQUUsT0FBa0I7UUFDdkUsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUE7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQTtRQUNoQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQTtRQUN4QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNqQixNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUc7WUFDaEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxRQUFRO1NBQ3RCLENBQUMsQ0FBQTtRQUNGLFFBQVEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQTtRQUM1QixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQ3hCLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQzlCLENBQUMsQ0FBQyxDQUFBO1FBQ0YsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN2QyxDQUFDO0lBRUQsWUFBWSxDQUFDLE9BQWlCO1FBQzFCLElBQUks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