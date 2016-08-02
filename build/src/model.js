"use strict";
const _ = require('lodash');
const cypher = require('./cypher');
const validator = require('./validator');
class Model {
    constructor(schema) {
        this.schema = schema;
        this.data = {};
        this.synchronized = false;
        for (let key in schema.fields) {
            Object.defineProperty(this, key, {
                get: () => {
                    return this.data[key];
                },
                set: (value) => {
                    this.set(key, value);
                    return this;
                },
                configurable: false,
                enumerable: true
            });
        }
    }
    type() {
        return this.schema.label;
    }
    instance(data) {
        let model = new Model(this.schema);
        if (data)
            model.setBulk(data);
        return model;
    }
    getData() {
        return this.data;
    }
    get(key) {
        if (_.has(this.schema.fields, key)) {
            return this.data[key];
        }
    }
    setBulk(object) {
        for (let key in object) {
            this.set(key, object[key]);
        }
    }
    set(key, value) {
        if (_.has(this.schema.fields, key)) {
            let keyType = this.schema.fields[key];
            let passed = validator.validateField(keyType, value);
            if (!passed)
                throw new Error(`Type of ${key} provided by program doesn't match the type 
                    definition in the schema. We can't set field.`);
            else
                this.data[key] = value;
            this.synchronized = false;
        }
        else {
            throw new Error(`${this.schema.label} doesn't have a field named ${key} in definition. 
               We can't set field.`);
        }
    }
    toDatabaseStructure(object) {
        let data = {};
        for (let key in object) {
            let value = object[key];
            if (_.has(this.schema.fields, key)) {
                let keyType = this.schema.fields[key];
                if (keyType === Date) {
                    data[key] = value.getTime();
                }
                else if (keyType === JSON) {
                    data[key] = JSON.stringify(value);
                }
                else {
                    data[key] = value;
                }
            }
        }
        return data;
    }
    fromDatabaseStructure(object) {
        let data = {};
        for (let key in object) {
            let value = object[key];
            if (_.has(this.schema.fields, key)) {
                let keyType = this.schema.fields[key];
                let [passed, valueCorrected] = validator.validateDataFromDbAndConvert(keyType, value);
                if (!passed)
                    throw new Error(`Type of ${key} provided by DB doesn't match the type 
                                     definition in the schema. We can't set property.`);
                else
                    data[key] = valueCorrected;
            }
            else {
                throw new Error(`${this.schema.label} doesn't have a field named ${key} in definition. 
                    We can't set property.`);
            }
        }
        return data;
    }
    save() {
        return new Promise((resolve, reject) => {
            this.schema.seraph.saveAsync(this.toDatabaseStructure(this.data), this.schema.label)
                .then(node => {
                this.data = this.fromDatabaseStructure(node);
                this.synchronized = true;
                return resolve(this);
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    saveRelation(field, model) {
        return new Promise((resolve, reject) => {
            if (_.has(this.schema.fields, field)) {
                if (!this['id'])
                    return reject('Model not saved yet. We cannot relate it to something else.');
                if (_.isUndefined(model['id']))
                    return reject(`${model.schema.label} isn't saved yet. We cannot relate it to something else.`);
                this.schema.seraph.relateAsync(this['id'], this.schema.fields[field].type, model['id'])
                    .then(result => {
                    return resolve(result);
                })
                    .catch(error => {
                    return reject(error);
                });
            }
            else {
                throw new Error(`${field} not found in schema ${this.schema}`);
            }
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject('`Warning: findById was called without the id parameter.');
            let query = cypher.queryByLabelAndId(this.schema.label, id);
            this.schema.seraph.queryAsync(query)
                .then(nodes => {
                if (nodes.length == 0)
                    return reject(`Warning: no node found with id=${id}`);
                if (nodes.length > 1)
                    return reject(`Warning: found more than one node with id=${id}`);
                return resolve(this.instance(this.fromDatabaseStructure(nodes[0])));
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    findByExample(predicates) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.queryAsync(cypher.queryFromPredicates(this.schema.label, predicates))
                .then(nodes => {
                let wrappedNodes = [];
                nodes.forEach(node => {
                    wrappedNodes.push(this.instance(this.fromDatabaseStructure(node)));
                });
                return resolve(wrappedNodes);
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    fetchRelation(relation) {
        return new Promise((resolve, reject) => {
        });
    }
    fetchRelations(relations) {
        return new Promise((resolve, reject) => {
        });
    }
    remove(id) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id;
            this.schema.seraph.labelAsync(id, [`_${this.schema.label}`], true)
                .then(() => {
                this.data = {};
                return resolve();
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    hardRemove(id) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id;
            this.schema.seraph.deleteAsync(id)
                .then(() => {
                this.data = {};
                return resolve();
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    count() {
        return new Promise((resolve, reject) => {
            let query = cypher.queryCount(this.schema.label);
            this.schema.seraph.queryAsync(query)
                .then(count => {
                if (!count)
                    return resolve(0);
                let key = Object.keys(count[0])[0];
                let c = count[0][key];
                return resolve(c);
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    dropId() {
        this.data.id = undefined;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBWSxNQUFNLFdBQU0sVUFDeEIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLFNBQVMsV0FBTSxhQUMzQixDQUFDLENBRHVDO0FBR3hDO0lBTUksWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2QsSUFBSSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUE7UUFDekIsR0FBRyxDQUFBLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUM3QixHQUFHLEVBQUU7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3pCLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLENBQUMsS0FBVTtvQkFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtvQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQTtnQkFDZixDQUFDO2dCQUNELFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUk7UUFDQSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFVO1FBQ2YsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLEVBQUUsQ0FBQSxDQUFDLElB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