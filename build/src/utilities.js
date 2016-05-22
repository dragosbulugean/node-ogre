"use strict";
function firstLetterToUpperCase(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}
exports.firstLetterToUpperCase = firstLetterToUpperCase;
function getterFunctionName(str) {
    return 'get' + firstLetterToUpperCase(str);
}
exports.getterFunctionName = getterFunctionName;
function setterFunctionName(str) {
    return 'set' + firstLetterToUpperCase(str);
}
exports.setterFunctionName = setterFunctionName;
//# sourceMappingURL=utilities.js.map