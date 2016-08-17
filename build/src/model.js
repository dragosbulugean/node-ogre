"use strict";
const _ = require('lodash');
const cypher = require('./cypher');
const validator = require('./validator');
class Model {
    constructor(schema) {
        this.schema = schema;
    }
    type() {
        return this.schema.label;
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
    save(data) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.saveAsync(this.toDatabaseStructure(data), this.schema.label)
                .then(node => {
                let result = this.fromDatabaseStructure(node);
                return resolve(result);
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    saveRelation(field, node1, node2) {
        return new Promise((resolve, reject) => {
            if (_.has(this.schema.fields, field)) {
                if (_.isUndefined(node1.id) || _.isUndefined(node2.id))
                    return reject(`Model or relatedToModel doesn't have id. We cannot save the relation.`);
                let type = this.schema.fields[field].type;
                let query = cypher.relateNodes(node1.id, node2.id, type);
                this.schema.seraph.queryAsync(query)
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
                return resolve(this.fromDatabaseStructure(nodes[0]));
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
                    wrappedNodes.push(this.fromDatabaseStructure(node));
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
            this.schema.seraph.labelAsync(id, [`_${this.schema.label}`], true)
                .then(() => {
                return resolve();
            })
                .catch(error => {
                return reject(error);
            });
        });
    }
    hardRemove(id) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.deleteAsync(id)
                .then(() => {
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBWSxNQUFNLFdBQU0sVUFDeEIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLFNBQVMsV0FBTSxhQUMzQixDQUFDLENBRHVDO0FBR3hDO0lBSUksWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO0lBQ3hCLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO0lBQzVCLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxNQUFXO1FBQzNCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtRQUNsQixHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN2QixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3JDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUMvQixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENB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