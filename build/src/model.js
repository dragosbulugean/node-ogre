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
    saveRelation(field, model, relatedToModel) {
        return new Promise((resolve, reject) => {
            if (_.has(this.schema.fields, field)) {
                if (_.isUndefined(model.id) || _.isUndefined(relatedToModel.id))
                    return reject(`Model or relatedToModel doesn't have id. We cannot save the relation.`);
                let type = this.schema.fields[field].type;
                this.schema.seraph.relateAsync(model.id, type, relatedToModel.id)
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