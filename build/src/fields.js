"use strict";
class Field {
    constructor(name) {
        this.name = name;
    }
    getAccesors() {
        return {
            getterFunction: () => { },
            setterFunction: () => { }
        };
    }
}
exports.Field = Field;
class Number extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
}
exports.Number = Number;
class Boolean extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
}
exports.Boolean = Boolean;
class String extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
}
exports.String = String;
class Moment extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
    convertToNeoType() {
        this.neoValue = this.value.getTime();
    }
    convertFromNeoType(neo) {
        this.value = new Date(this.neoValue);
    }
}
exports.Moment = Moment;
class Array extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
}
exports.Array = Array;
class Dictionary extends Field {
    getAccesors() {
        let getterFunction = () => this.value;
        let setterFunction = (value) => {
            this.value = value;
            return this;
        };
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        };
    }
    convertToNeoType() {
        this.neoValue = JSON.stringify(this.value);
    }
    convertFromNeoType() {
        this.value = JSON.parse(this.neoValue);
    }
}
exports.Dictionary = Dictionary;
class Relation extends Field {
}
exports.Relation = Relation;
class OneRelation extends Relation {
}
exports.OneRelation = OneRelation;
class ManyRelation extends Relation {
}
exports.ManyRelation = ManyRelation;
var FieldTypes;
(function (FieldTypes) {
    FieldTypes[FieldTypes["String"] = 0] = "String";
    FieldTypes[FieldTypes["Number"] = 1] = "Number";
    FieldTypes[FieldTypes["Date"] = 2] = "Date";
    FieldTypes[FieldTypes["Array"] = 3] = "Array";
    FieldTypes[FieldTypes["JSON"] = 4] = "JSON";
    FieldTypes[FieldTypes["Boolean"] = 5] = "Boolean";
    FieldTypes[FieldTypes["OneRelation"] = 6] = "OneRelation";
    FieldTypes[FieldTypes["ManyRelation"] = 7] = "ManyRelation";
})(FieldTypes || (FieldTypes = {}));
//# sourceMappingURL=fields.js.map