"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Schema = (function () {
    function Schema(label, fields) {
        this.label = label;
        this.fields = fields;
    }
    Schema.prototype.setSeraph = function (seraph) {
        this.seraph = seraph;
    };
    return Schema;
}());
exports.default = Schema;
//# sourceMappingURL=schema.js.map