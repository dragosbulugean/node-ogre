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
    return `${exports.matchLabel(mapName, label)} ${exports.whereId(mapName, id)} ${exports.returnNode(mapName)}`;
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
    return `${exports.matchLabel(mapName, label)} ${exports.predicatesToString(mapName, predicates)} ${exports.returnNode(mapName)}`;
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
    let value = _.isString(predicate.value) ? `"${predicate.value}"` : predicate.value;
    return `${mapName}.${predicate.field}=${value}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2N5cGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsTUFBWSxDQUFDLFdBQU0sUUFFbkIsQ0FBQyxDQUYwQjtBQUVoQixrQkFBVSxHQUFHLENBQUMsT0FBZSxFQUFFLEtBQWE7SUFDbkQsTUFBTSxDQUFDLFlBQVksS0FBSyxHQUFHLENBQUE7QUFDL0IsQ0FBQyxDQUFBO0FBRVUsYUFBSyxHQUFHLENBQUMsT0FBZTtJQUMvQixNQUFNLENBQUMsU0FBUyxPQUFPLEdBQUcsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSxlQUFPLEdBQUcsQ0FBQyxPQUFlLEVBQUUsRUFBVTtJQUM3QyxNQUFNLENBQUMsZUFBZSxFQUFFLEVBQUUsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSxrQkFBVSxHQUFHLENBQUMsT0FBZTtJQUNwQyxNQUFNLENBQUMsVUFBVSxPQUFPLEVBQUUsQ0FBQTtBQUM5QixDQUFDLENBQUE7QUFFVSx5QkFBaUIsR0FBRyxDQUFDLEtBQWEsRUFBRSxFQUFVO0lBQ3JELElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQTtJQUNqQixNQUFNLENBQUMsR0FBRyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxlQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLGtCQUFVLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQTtBQUN6RixDQUFDLENBQUE7QUFFVSxtQkFBVyxHQUFHLENBQUMsT0FBZTtJQUNyQyxNQUFNLENBQUMsZ0JBQWdCLE9BQU8sR0FBRyxDQUFBO0FBQ3JDLENBQUMsQ0FBQTtBQUVVLGtCQUFVLEdBQUcsQ0FBQyxLQUFhO0lBQ2xDLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQTtJQUNqQixNQUFNLENBQUMsR0FBRyxrQkFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsSUFBSSxtQkFBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7QUFDbEUsQ0FBQyxDQUFBO0FBRVUsMkJBQW1CLEdBQUcsQ0FBQyxLQUFhLEVBQUUsVUFBdUI7SUFDcEUsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFBO0lBQ2pCLE1BQU0sQ0FBQyxHQUFHLGtCQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLDBCQUFrQixDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsSUFBSSxrQkFBVSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUE7QUFDNUcsQ0FBQyxDQUFBO0FBRVUsMEJBQWtCLEdBQUcsQ0FBQyxPQUFlLEVBQUUsVUFBdUI7SUFDckUsSUFBSSxnQkFBZ0IsR0FBYSxFQUFFLENBQUE7SUFDbkMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxTQUFTO1FBQ3hCLGdCQUFnQixDQUFDLElBQUksQ0FBQyx5QkFBaUIsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUM1RCxFQUFFLENBQUEsQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDO1lBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUM1RSxDQUFDLENBQUMsQ0FBQTtJQUNGLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUM1QyxFQUFFLENBQUEsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLEtBQUssS0FBSyxJQUFJLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLElBQUksQ0FBQztRQUNuRixVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFBO0lBQzNCLE1BQU0sQ0FBQyxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0FBQ2hELENBQUMsQ0FBQTtBQUVVLHlCQUFpQixHQUFHLENBQUMsT0FBZSxFQUFFLFNBQW9CO0lBQ2pFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksU0FBUyxDQUFDLEtBQUssR0FBRyxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUE7SUFDbEYsTUFBTSxDQUFDLEdBQUcsT0FBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLElBQUksS0FBSyxFQUFFLENBQUE7QUFDbkQsQ0FBQyxDQUFBIn0=