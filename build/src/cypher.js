"use strict";
const _ = require('lodash');
exports.matchLabel = (mapName, label) => {
    return `match (n:${label})`;
};
exports.where = (mapName) => {
    return `where ${mapName}.`;
};
exports.whereId = (mapName, id) => {
    return `where id(n)=${id}`;
};
exports.returnNode = (mapName) => {
    return `return ${mapName}`;
};
exports.queryByLabelAndId = (label, id) => {
    let mapName = 'n';
    return `${exports.matchLabel(mapName, label)} 
            ${exports.whereId(mapName, id)} 
            ${exports.returnNode(mapName)}`;
};
exports.returnCount = (mapName) => {
    return `return count(${mapName})`;
};
exports.queryCount = (label) => {
    let mapName = 'n';
    return `${exports.matchLabel(mapName, label)} ${exports.returnCount(mapName)}`;
};
exports.queryFromPredicates = (label, predicates) => {
    let mapName = 'n';
    return `${exports.matchLabel(mapName, label)} 
            ${exports.predicatesToString(mapName, predicates)} 
            ${exports.returnNode(mapName)}`;
};
exports.predicatesToString = (mapName, predicates) => {
    let predicateStrings = [];
    predicates.forEach(predicate => {
        predicateStrings.push(exports.predicateToString(mapName, predicate));
        if (predicate.continuation)
            predicateStrings.push(predicate.continuation);
    });
    let lastQueryPart = _.last(predicateStrings);
    if (lastQueryPart.toLowerCase() === 'and' || lastQueryPart.toLocaleLowerCase() === 'or')
        predicates.splice(-1, 1);
    return `where ` + predicateStrings.join(' ');
};
exports.predicateToString = (mapName, predicate) => {
    let value;
    if (_.isString(predicate.value))
        value = `"${predicate.value}"`;
    else
        value = predicate.value;
    return `${mapName}.${predicate.field}=${value}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2N5cGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsTUFBWSxDQUFDLFdBQU0sUUFFbkIsQ0FBQyxDQUYwQjtBQUVoQixrQkFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLEtBQWE7SUFDbkQsTUFBTSxDQUFDLFlBQVksS0FBSyxHQUFHLENBQUE7QUFDL0IsQ0FBQyxDQUFBO0FBRVUsYUFBSyxHQUFHLENBQUMsT0FBZTtJQUMvQixNQUFNLENBQUMsU0FBUyxPQUFPLEdBQUcsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSxlQUFPLEdBQUcsQ0FBQyxPQUFlLEVBQUUsRUFBVTtJQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSxrQkFBVSxHQUFHLENBQUMsT0FBZTtJQUNwQyxNQUFNLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSx5QkFBaUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFVO0lBQ3JELElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQTtJQUNqQixNQUFNLENBQUMsR0FBRyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUM7Y0FDMUIsZUFBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7Y0FDcEIsa0JBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFBO0FBQ25DLENBQUMsQ0FBQTtBQUVVLG1CQUFXLEdBQUcsQ0FBQyxPQUFlO0lBQ3JDLE1BQU0sQ0FBQyxnQkFBZ0IsT0FBTyxHQUFHLENBQUE7QUFDckMsQ0FBQyxDQUFBO0FBRVUsa0JBQVUsR0FBRyxDQUFDLEtBQWE7SUFDbEMsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFBO0lBQ2pCLE1BQU0sQ0FBQyxHQUFHLGtCQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLG1CQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQTtBQUNsRSxDQUFDLENBQUE7QUFFVSwyQkFBbUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxVQUF1QjtJQUNwRSxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUE7SUFDakIsTUFBTSxDQUFDLEdBQUcsa0JBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDO2NBQzFCLDBCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUM7Y0FDdkMsa0JBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFBO0FBQ25DLENBQUMsQ0FBQTtBQUVVLDBCQUFrQixHQUFHLENBQUMsT0FBZSxFQUFFLFVBQXVCO0lBQ3JFLElBQUksZ0JBQWdCLEdBQWEsRUFBRSxDQUFBO0lBQ25DLFVBQVUsQ0FBQyxPQUFPLENBQUMsU0FBUztRQUN4QixnQkFBZ0IsQ0FBQyxJQUFJLENBQUMseUJBQWlCLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUE7UUFDNUQsRUFBRSxDQUFBLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQztZQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLENBQUE7SUFDNUUsQ0FBQyxDQUFDLENBQUE7SUFDRixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFDNUMsRUFBRSxDQUFBLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssSUFBSSxhQUFhLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxJQUFJLENBQUM7UUFDbkYsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQTtJQUMzQixNQUFNLENBQUMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtBQUNoRCxDQUFDLENBQUE7QUFFVSx5QkFBaUIsR0FBRyxDQUFDLE9BQWUsRUFBRSxTQUFvQjtJQUNqRSxJQUFJLEtBQUssQ0FBQTtJQUNULEVBQUUsQ0FBQSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQUMsS0FBSyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssR0FBRyxDQUFBO0lBQzlELElBQUk7UUFBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQTtJQUM1QixNQUFNLENBQUMsR0FBRyxPQUFPLElBQUksU0FBUyxDQUFDLEtBQUssSUFBSSxLQUFLLEVBQUUsQ0FBQTtBQUNuRCxDQUFDLENBQUEifQ==