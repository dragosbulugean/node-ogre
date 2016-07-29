"use strict";
const seraph = require("seraph");
class Ogre {
    constructor(url, user, password, schemas) {
        this.url = url;
        this.user = user;
        this.password = password;
        this.seraph = seraph({
            server: this.url,
            user: this.user,
            pass: this.password
        });
        this.schemas = schemas;
        this.schemas.forEach(model => {
            model.setSeraph(this.seraph);
        });
    }
    model(label, schema) {
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ogre;
exports.Operators = {
    'and': 'AND',
    'or': 'OR',
    'in': 'IN',
    'eq': '=',
    'neq': '<>',
    'gt': '>',
    'lt': '<',
    'gte': '>=',
    'lte': '<=',
    'regex': '=~',
    'n': 'IS NULL',
    'nn': 'IS NOT NULL'
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2dyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vZ3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFFaEM7SUFRSSxZQUFZLEdBQVcsRUFBRSxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxPQUFpQjtRQUN0RSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRztZQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDdEIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFDdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSztZQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtRQUM5QixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQWM7SUFFM0IsQ0FBQztBQUVMLENBQUM7QUEzQkQ7c0JBMkJDLENBQUE7QUFFVSxpQkFBUyxHQUFHO0lBQ3RCLEtBQUssRUFBSyxLQUFLO0lBQ2YsSUFBSSxFQUFNLElBQUk7SUFDZCxJQUFJLEVBQU0sSUFBSTtJQUNkLElBQUksRUFBTSxHQUFHO0lBQ2IsS0FBSyxFQUFLLElBQUk7SUFDZCxJQUFJLEVBQU0sR0FBRztJQUNiLElBQUksRUFBTSxHQUFHO0lBQ2IsS0FBSyxFQUFLLElBQUk7SUFDZCxLQUFLLEVBQUssSUFBSTtJQUNkLE9BQU8sRUFBRyxJQUFJO0lBQ2QsR0FBRyxFQUFPLFNBQVM7SUFDbkIsSUFBSSxFQUFNLGFBQWE7Q0FDdkIsQ0FBQSJ9