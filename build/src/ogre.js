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
        // for (let schemaKey in schemaMap) {
        //     let schema = schemaMap[schemaKey]
        //     for (let fieldKey in schema.fields) {
        //         let field = schema.fields[fieldKey]
        //         if(field instanceof Relation) {
        //         } 
        //     }
        // }
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
        this.direction = direction;
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