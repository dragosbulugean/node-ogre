"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
exports.matchLabel = function (mapName, label) {
    return "match (n:" + label + ")";
};
exports.where = function (mapName) {
    return "where " + mapName + ".";
};
exports.whereId = function (mapName, id) {
    return "where id(n)=" + id;
};
exports.returnNode = function (mapName) {
    return "return " + mapName;
};
exports.queryByLabelAndId = function (label, id) {
    var mapName = 'n';
    return exports.matchLabel(mapName, label) + " " + exports.whereId(mapName, id) + " " + exports.returnNode(mapName);
};
exports.returnCount = function (mapName) {
    return "return count(" + mapName + ")";
};
exports.queryCount = function (label) {
    var mapName = 'n';
    return exports.matchLabel(mapName, label) + " " + exports.returnCount(mapName);
};
exports.predicateToString = function (mapName, predicate) {
    var value = _.isString(predicate.value) ? "\"" + predicate.value + "\"" : predicate.value;
    return mapName + "." + predicate.field + "=" + value;
};
exports.predicatesToString = function (mapName, predicates) {
    var predicateStrings = [];
    predicates.forEach(function (predicate) {
        predicateStrings.push(exports.predicateToString(mapName, predicate));
        if (predicate.continuation)
            predicateStrings.push(predicate.continuation);
    });
    var lastQueryPart = _.last(predicateStrings);
    if (lastQueryPart.toLowerCase() === 'and' || lastQueryPart.toLocaleLowerCase() === 'or')
        predicates.splice(-1, 1);
    return "where " + predicateStrings.join(' ');
};
exports.queryFromPredicates = function (label, predicates) {
    var mapName = 'n';
    return exports.matchLabel(mapName, label) + " " + exports.predicatesToString(mapName, predicates) + " " + exports.returnNode(mapName);
};
exports.relateNodes = function (node1Id, node2Id, type) {
    return "match (n1), (n2) where id(n1)=" + node1Id + " and id(n2)=" + node2Id + "             create (n1)-[r:" + type + "]->(n2) return r";
};
//# sourceMappingURL=cypher.js.map