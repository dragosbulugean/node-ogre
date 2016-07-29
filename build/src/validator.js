"use strict";
const _ = require("lodash");
exports.validateField = (keyType, value) => {
    let passed = true;
    if (keyType === String) {
        if (!_.isString(value))
            passed = false;
    }
    else if (keyType === Number) {
        if (!_.isNumber(value))
            passed = false;
    }
    else if (keyType === Boolean) {
        if (!_.isBoolean(value))
            passed = false;
    }
    else if (keyType === Date) {
        if (!_.isDate(value))
            passed = false;
    }
    else if (_.isArray(keyType)) {
        if (keyType[0] === String) {
            passed = _.every(value, i => _.isString(i) ? true : false);
        }
        else if (keyType[0] === Number) {
            passed = _.every(value, i => _.isNumber(i) ? true : false);
        }
        else if (keyType[0] === Boolean) {
            passed = _.every(value, i => _.isBoolean(i) ? true : false);
        }
        else {
            passed = false;
        }
    }
    else if (keyType === JSON) {
        if (!_.isObject(value))
            passed = false;
    }
    return passed;
};
//TODO change this -- method does multiple things
exports.validateDataFromDbAndConvert = (keyType, value) => {
    let passed = true;
    if (keyType === String) {
        if (!_.isString(value))
            passed = false;
    }
    else if (keyType === Number) {
        if (!_.isNumber(value))
            passed = false;
    }
    else if (keyType === Boolean) {
        if (!_.isBoolean(value))
            passed = false;
    }
    else if (keyType === Date) {
        value = new Date(value);
        if (!_.isDate(value))
            passed = false;
    }
    else if (_.isArray(keyType)) {
        if (keyType[0] !== String && keyType[0] !== Number && keyType[0] !== Boolean)
            passed = false;
    }
    else {
        value = JSON.parse(value);
    }
    return [passed, value];
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3ZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBWSxDQUFDLFdBQU0sUUFFbkIsQ0FBQyxDQUYwQjtBQUVoQixxQkFBYSxHQUFHLENBQUMsT0FBTyxFQUFFLEtBQUs7SUFDdEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFBO0lBQ2pCLEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFDekMsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzQixFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFBQyxNQUFNLEdBQUcsS0FBSyxDQUFBO0lBQ3pDLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFBLENBQUMsT0FBTyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUIsRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQTtJQUMxQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUFDLE1BQU0sR0FBRyxLQUFLLENBQUE7SUFDdkMsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFD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