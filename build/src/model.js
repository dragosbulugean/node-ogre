"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var cypher = require("./cypher");
var validator = require("./validator");
var Model = (function () {
    function Model(schema) {
        this.schema = schema;
    }
    Model.prototype.type = function () {
        return this.schema.label;
    };
    Model.prototype.toDatabaseStructure = function (object) {
        var data = {};
        for (var key in object) {
            if (_.has(this.schema.fields, key)) {
                var value = object[key];
                var keyType = this.schema.fields[key];
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
    };
    Model.prototype.fromDatabaseStructure = function (object) {
        var data = {};
        for (var key in object) {
            if (_.has(this.schema.fields, key)) {
                var value = object[key];
                var keyType = this.schema.fields[key];
                var _a = validator.validateDataFromDbAndConvert(keyType, value), passed = _a[0], valueCorrected = _a[1];
                if (!passed)
                    throw new Error("Type of " + key + " provided by DB doesn't match the type \n                                     definition in the schema. We can't set property.");
                else
                    data[key] = valueCorrected;
            }
            else {
                throw new Error(this.schema.label + " doesn't have a field named " + key + " in definition. \n                    We can't set property.");
            }
        }
        return data;
    };
    Model.prototype.save = function (data) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.schema.seraph.saveAsync(_this.toDatabaseStructure(data), _this.schema.label)
                .then(function (node) {
                var result = _this.fromDatabaseStructure(node);
                return resolve(result);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    Model.prototype.saveRelation = function (field, node1, node2) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_.has(_this.schema.fields, field)) {
                if (_.isUndefined(node1.id) || _.isUndefined(node2.id))
                    return reject("Model or relatedToModel doesn't have id. We cannot save the relation.");
                var type = _this.schema.fields[field].type;
                var query = cypher.relateNodes(node1.id, node2.id, type);
                _this.schema.seraph.queryAsync(query)
                    .then(function (result) {
                    return resolve(result);
                })
                    .catch(function (error) {
                    return reject(error);
                });
            }
            else {
                throw new Error(field + " not found in schema " + _this.schema);
            }
        });
    };
    Model.prototype.findById = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!id)
                return reject('`Warning: findById was called without the id parameter.');
            var query = cypher.queryByLabelAndId(_this.schema.label, id);
            _this.schema.seraph.queryAsync(query)
                .then(function (nodes) {
                if (nodes.length === 0)
                    return reject("Warning: no node found with id=" + id);
                if (nodes.length > 1)
                    return reject("Warning: found more than one node with id=" + id);
                return resolve(_this.fromDatabaseStructure(nodes[0]));
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    Model.prototype.findByExample = function (predicates) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.schema.seraph.queryAsync(cypher.queryFromPredicates(_this.schema.label, predicates))
                .then(function (nodes) {
                var wrappedNodes = [];
                nodes.forEach(function (node) {
                    wrappedNodes.push(_this.fromDatabaseStructure(node));
                });
                return resolve(wrappedNodes);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    Model.prototype.fetchRelation = function (relation) {
        return new Promise(function (resolve, reject) {
            reject('Not yet implemented.');
        });
    };
    Model.prototype.fetchRelations = function (relations) {
        return new Promise(function (resolve, reject) {
            reject('Not yet implemented.');
        });
    };
    Model.prototype.remove = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.schema.seraph.labelAsync(id, ["_" + _this.schema.label], true)
                .then(function () {
                return resolve();
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    Model.prototype.hardRemove = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.schema.seraph.deleteAsync(id)
                .then(function () {
                return resolve();
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    Model.prototype.count = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var query = cypher.queryCount(_this.schema.label);
            _this.schema.seraph.queryAsync(query)
                .then(function (count) {
                if (!count)
                    return resolve(0);
                var key = Object.keys(count[0])[0];
                var c = count[0][key];
                return resolve(c);
            })
                .catch(function (error) {
                return reject(error);
            });
        });
    };
    return Model;
}());
exports.default = Model;
//# sourceMappingURL=model.js.map