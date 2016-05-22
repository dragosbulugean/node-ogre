"use strict";
function matchLabel(label) {
    return `match (n:${label})`;
}
exports.matchLabel = matchLabel;
function whereId(id) {
    return `where id(n)=${id}`;
}
exports.whereId = whereId;
function findModelByIdQuery(label, id) {
    return `${matchLabel(label)} ${whereId(id)}`;
}
exports.findModelByIdQuery = findModelByIdQuery;
//# sourceMappingURL=cypher.js.map