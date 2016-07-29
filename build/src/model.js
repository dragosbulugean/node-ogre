"use strict";
const _ = require('lodash');
const cypher = require('./cypher');
const validator = require('./validator');
class Model {
    constructor(schema) {
        this.schema = schema;
        this.data = {};
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
            this.schema.seraph.save(this.toDatabaseStructure(this.data), this.schema.label, (err, node) => {
                if (err)
                    reject(err);
                this.data = this.fromDatabaseStructure(node);
                return resolve(this);
            });
        });
    }
    findById(id) {
        return new Promise((resolve, reject) => {
            if (!id)
                return reject('`Warning: findById was called without the id parameter.');
            let query = cypher.queryByLabelAndId(this.schema.label, id);
            this.schema.seraph.query(query, (err, nodes) => {
                if (err)
                    return reject(err);
                if (nodes.length == 0)
                    return reject(`Warning: no node found with id=${id}`);
                if (nodes.length > 1)
                    return reject(`Warning: found more than one node with id=${id}`);
                return resolve(this.instance(this.fromDatabaseStructure(nodes[0])));
            });
        });
    }
    findByExample(predicates) {
        return new Promise((resolve, reject) => {
            this.schema.seraph.query(cypher.queryFromPredicates(this.schema.label, predicates), (err, nodes) => {
                if (err)
                    return reject(err);
                let wrappedNodes = [];
                nodes.forEach(node => {
                    wrappedNodes.push(this.instance(this.fromDatabaseStructure(node)));
                });
                return resolve(wrappedNodes);
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
            this.schema.seraph.label(id, [`_${this.schema.label}`], true, (err) => {
                if (err)
                    return reject(err);
                this.data = {};
                return resolve();
            });
        });
    }
    hardRemove(id) {
        return new Promise((resolve, reject) => {
            id = id || this.data.id;
            this.schema.seraph.delete(id, (err) => {
                if (err)
                    return reject(err);
                this.data = {};
                return resolve();
            });
        });
    }
    count() {
        return new Promise((resolve, reject) => {
            let query = cypher.queryCount(this.schema.label);
            this.schema.seraph.query(query, (err, count) => {
                if (err)
                    return reject(err);
                if (!count)
                    return resolve(0);
                let key = Object.keys(count[0])[0];
                let c = count[0][key];
                return resolve(c);
            });
        });
    }
    dropId() {
        delete this.data.id;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Model;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbW9kZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE1BQVksQ0FBQyxXQUFNLFFBQ25CLENBQUMsQ0FEMEI7QUFDM0IsTUFBWSxNQUFNLFdBQU0sVUFDeEIsQ0FBQyxDQURpQztBQUNsQyxNQUFZLFNBQVMsV0FBTSxhQUMzQixDQUFDLENBRHVDO0FBR3hDO0lBS0ksWUFBWSxNQUFjO1FBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFBO1FBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2QsR0FBRyxDQUFBLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUM3QixHQUFHLEVBQUU7b0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3pCLENBQUM7Z0JBQ0QsR0FBRyxFQUFFLENBQUMsS0FBVTtvQkFDWixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQTtvQkFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQTtnQkFDZixDQUFDO2dCQUNELFlBQVksRUFBRSxLQUFLO2dCQUNuQixVQUFVLEVBQUUsSUFBSTthQUNuQixDQUFDLENBQUE7UUFDTixDQUFDO0lBQ0wsQ0FBQztJQUVELFFBQVEsQ0FBQyxJQUFVO1FBQ2YsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFBO1FBQ2xDLEVBQUUsQ0FBQSxDQUFDLElBQUksQ0FBQztZQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQTtJQUNoQixDQUFDO0lBRUQsT0FBTztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFBO0lBQ3BCLENBQUM7SUFFRCxHQUFHLENBQUMsR0FBVztRQUNYLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3pCLENBQUM7SUFDTCxDQUFDO0lBRUQsT0FBTyxDQUFDLE1BQVc7UUFDZixHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFBO1FBQzlCLENBQUM7SUFDTCxDQUFDO0lBRUQsR0FBRyxDQUFDLEdBQVcsRUFBRSxLQUFVO1FBQ3ZCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ3JDLElBQUksTUFBTSxHQUFZLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFBO1lBQzdELEVBQUUsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQ1gsV0FBVyxHQUFHO2tFQUNnQyxDQUFDLENBQUE7WUFDdkQsSUFBSTtnQkFDQSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtRQUU5QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLElBQUksS0FBSyxDQUNYLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLCtCQUErQixHQUFHO21DQUNqQyxDQUFDLENBQUE7UUFDNUIsQ0FBQztJQUNMLENBQUM7SUFFRCxtQkFBbUIsQ0FBQyxNQUFXO1FBQzNCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtRQUNsQixHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN2QixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3JDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBO2dCQUMvQixDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ3JDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQTtnQkFDckIsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFFRCxxQkFBcUIsQ0FBQyxNQUFXO1FBQzdCLElBQUksSUFBSSxHQUFRLEVBQUUsQ0FBQTtRQUNsQixHQUFHLENBQUEsQ0FBQyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtZQUN2QixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3JDLElBQUksQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLEdBQ3hCLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUE7Z0JBQzFELEVBQUUsQ0FBQSxDQUFDLENBQUMsTUFBTSxDQUFDO29CQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsV0FBVyxHQUFHO3NGQUNvQyxDQUFDLENBQUE7Z0JBQ3ZFLElBQUk7b0JBQ0EsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGNBQWMsQ0FBQTtZQUVsQyxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ0osTUFBTSxJQUFJLEtBQUssQ0FDWCxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSywrQkFBK0IsR0FBRzsyQ0FDL0IsQ0FBQyxDQUFBO1lBQ2hDLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFFRCxJQUFJO1FBQ0EsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUNuQixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUk7Z0JBQzlELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQztvQkFBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQ3BCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO2dCQUM1QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO1lBQ3hCLENBQUMsQ0FBQyxDQUFBO1FBQ1YsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsUUFBUSxDQUFDLEVBQVU7UUFDZixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixFQUFFLENBQUEsQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLHlEQUF5RCxDQUFDLENBQUE7WUFDaEYsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQzNELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSztnQkFDdkMsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzFCLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsa0NBQWtDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQzNFLEVBQUUsQ0FBQSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsNkNBQTZDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQ3JGLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3ZFLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsYUFBYSxDQUFDLFVBQXVCO1FBQ2pDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FDcEIsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUs7Z0JBQ2xFLEVBQUUsQ0FBQSxDQUFDLEdBQUcsQ0FBQztvQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUMxQixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUE7Z0JBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSTtvQkFDZCxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDdEUsQ0FBQyxDQUFDLENBQUE7Z0JBQ0YsTUFBTSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtZQUNwQyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELGFBQWEsQ0FBQyxRQUFnQjtRQUMxQixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtRQUNuQyxDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxjQUFjLENBQUMsU0FBbUI7UUFDOUIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07UUFDbkMsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQVc7UUFDZCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixFQUFFLEdBQUcsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFBO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxHQUFHO2dCQUM5RCxFQUFFLENBQUEsQ0FBQyxHQUFHLENBQUM7b0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDMUIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUE7Z0JBQ2QsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO1lBQ3BCLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsVUFBVSxDQUFDLEVBQVc7UUFDbEIsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRztnQkFDOUIsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzNCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFBO2dCQUNkLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQTtZQUNwQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELEtBQUs7UUFDRCxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7WUFDaEQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLO2dCQUN2QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7b0JBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQTtnQkFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7b0JBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDN0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtnQkFDbEMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBO2dCQUNyQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQ3JCLENBQUMsQ0FBQyxDQUFBO1FBQ04sQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsTUFBTTtRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUE7SUFDdkIsQ0FBQztBQUVMLENBQUM7QUEvTEQ7dUJBK0xDLENBQUEifQ==