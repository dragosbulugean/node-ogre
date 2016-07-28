"use strict";
const _ = require('lodash');
const cypher = require('./cypher');
class Model {
    constructor(schema) {
        this.schema = schema;
        this.data = {};
    }
    set(key, value) {
        if (_.has(this.schema.fields, key)) {
            let passed = true;
            let keyType = this.schema.fields[key];
            if (keyType === String)
                if (!_.isString(value))
                    passed = false;
                else
                    this.data[key] = value;
            if (keyType === Number)
                if (!_.isNumber(value))
                    passed = false;
                else
                    this.data[key] = value;
            if (keyType === Boolean)
                if (!_.isBoolean(value))
                    passed = false;
                else
                    this.data[key] = value;
            if (keyType === Date)
                if (!_.isDate(value))
                    passed = false;
                else
                    this.data[key] = value.getTime();
            if (!passed)
                console.warn(`Type of ${key} provided doesn't match the type 
                              definition in the schema. We can't set property.`);
        }
        else {
            console.warn(`${this.schema.label} doesn't have a field named ${key} in definition. 
                        We can't set property.`);
        }
    }
    setBulk(object) {
        for (let key in object) {
            this.set(key, object[key]);
        }
    }
    fromDatabaseStructure(object) {
        let data = {};
        for (let key in object) {
            let value = object[key];
            if (_.has(this.schema.fields, key)) {
                let passed = true;
                let keyType = this.schema.fields[key];
                if (keyType === String)
                    data[key] = value;
                if (keyType === Number)
                    data[key] = value;
                if (keyType === Boolean)
                    data[key] = value;
                if (keyType === Date)
                    data[key] = new Date(value);
            }
            else {
                console.warn(`${this.schema.label} doesn't have a field named ${key} in definition. 
                              We can't set property.`);
            }
        }
        return data;
    }
    save() {
        return new Promise((resolve, reject) => {
            this.schema.seraph.save(this.data, this.schema.label, (err, node) => {
                if (err)
                    reject(err);
                this.data = this.fromDatabaseStructure(node);
                return resolve(this.data);
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            let query = cypher.queryByLabelAndId(this.schema.label, id);
            this.schema.seraph.query(query, (err, nodes) => {
                if (err)
                    return reject(err);
                if (nodes.length == 0)
                    return reject(`Warning: no node found with id=${id}`);
                if (nodes.length > 1)
                    return reject(`Warning: found more than one node with id=${id}`);
                this.data = this.fromDatabaseStructure(nodes[0]);
                return resolve(this.data);
            });
        });
    }
    findByExample(predicate) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.find();
        });
    }
    remove(id) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id;
            this.schema.seraph.label(id, [`_${this.schema.label}`], true, function (err) {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    }
    hardRemove(id) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id;
            this.schema.seraph.delete(id, function (err) {
                if (err)
                    return reject(err);
                return resolve();
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBWSxNQUFNLFdBQU0sVUFFeEIsQ0FBQyxDQUZpQztBQUVsQztJQUtJLFlBQVksTUFBYztRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQTtRQUNwQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQTtJQUNsQixDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3ZCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksTUFBTSxHQUFZLElBQUksQ0FBQTtZQUMxQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUVyQyxFQUFFLENBQUEsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDO2dCQUNsQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtnQkFDckMsSUFBSTtvQkFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtZQUUvQixFQUFFLENBQUEsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDO2dCQUNsQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtnQkFDckMsSUFBSTtvQkFBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtZQUUvQixFQUFF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