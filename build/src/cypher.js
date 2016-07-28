"use strict";
exports.matchLabel = (varname, label) => {
    return `match (n:${label})`;
};
exports.whereId = (varname, id) => {
    return `where id(n)=${id}`;
};
exports.returnNode = (varname) => {
    return `return ${varname}`;
};
exports.queryByLabelAndId = (label, id) => {
    let varname = 'n';
    return `${exports.matchLabel(varname, label)} ${exports.whereId(varname, id)} ${exports.returnNode(varname)}`;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3lwaGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2N5cGhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQVcsa0JBQVUsR0FBRyxDQUFDLE9BQWUsRUFBRSxLQUFhO0lBQ25ELE1BQU0sQ0FBQyxZQUFZLEtBQUssR0FBRyxDQUFBO0FBQy9CLENBQUMsQ0FBQTtBQUVVLGVBQU8sR0FBRyxDQUFDLE9BQWUsRUFBRSxFQUFVO0lBQzdDLE1BQU0sQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFBO0FBQzlCLENBQUMsQ0FBQTtBQUVVLGtCQUFVLEdBQUcsQ0FBQyxPQUFlO0lBQ3BDLE1BQU0sQ0FBQyxVQUFVLE9BQU8sRUFBRSxDQUFBO0FBQzlCLENBQUMsQ0FBQTtBQUVVLHlCQUFpQixHQUFHLENBQUMsS0FBYSxFQUFFLEVBQVU7SUFDckQsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFBO0lBQ2pCLE1BQU0sQ0FBQyxHQUFHLGtCQUFVLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxJQUFJLGVBQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLElBQUksa0JBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFBO0FBQ3pGLENBQUMsQ0FBQSJ9