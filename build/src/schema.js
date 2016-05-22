"use strict";
const cypher = require('./cypher');
const utilities = require('./utilities');
class Schema {
    constructor() {
    }
    findById(label, id) {
        return cypher.findModelByIdQuery(label, id);
    }
    instantiate() {
        let model = {
            schema: this
        };
        for (let f in this) {
            model['label'] = this.label;
            let field = this[f];
            model[field] = undefined;
            let accesors = field.getAccesors();
            model[utilities.getterFunctionName(field.name)] = accesors.getterFunction;
            model[utilities.setterFunctionName(field.name)] = accesors.setterFunction;
            model['findById'] = this.findById;
        }
        if (!Schema.model)
            Schema.model = model;
        return Schema.model;
    }
}
Schema.model = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Schema;
//# sourceMappingURL=schema.js.map