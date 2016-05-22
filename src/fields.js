"use strict";
class Relation {
}
class OneRelation extends Relation {
}
class ManyRelation extends Relation {
}
var FieldTypes;
(function (FieldTypes) {
    FieldTypes[FieldTypes["string"] = 0] = "string";
    FieldTypes[FieldTypes["number"] = 1] = "number";
    FieldTypes[FieldTypes["OneRelation"] = 2] = "OneRelation";
    FieldTypes[FieldTypes["ManyRelation"] = 3] = "ManyRelation";
})(FieldTypes || (FieldTypes = {}));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FieldTypes;
