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
        this.schemas = schemas || [];
        this.schemas.forEach(model => {
            model.setSeraph(this.seraph);
        });
    }
    query(query) {
        return new Promise((resolve, reject) => {
            this.seraph.query(query, (err, response) => {
                if (err)
                    return reject(err);
                resolve(response);
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Ogre;
//Let here for documentation purposes
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2dyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vZ3JlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFFQSxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFFaEM7SUFRSSxZQUFZLEdBQVcsRUFBRSxJQUFZLEVBQUUsUUFBZ0IsRUFBRSxPQUFrQjtRQUN2RSxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQTtRQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFBO1FBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFBO1FBQ3hCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ2pCLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBRztZQUNoQixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7WUFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDdEIsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFBO1FBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEtBQUs7WUFDeEIsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUE7UUFDOUIsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQWE7UUFDZixNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEVBQUUsUUFBUTtnQkFDbkMsRUFBRSxDQUFBLENBQUMsR0FBRyxDQUFDO29CQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7Z0JBQzFCLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUNyQixDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztBQUVMLENBQUM7QUFoQ0Q7c0JBZ0NDLENBQUE7QUFFRCxxQ0FBcUM7QUFDMUIsaUJBQVMsR0FBRztJQUN0QixLQUFLLEVBQUssS0FBSztJQUNmLElBQUksRUFBTSxJQUFJO0lBQ2QsSUFBSSxFQUFNLElBQUk7SUFDZCxJQUFJLEVBQU0sR0FBRztJQUNiLEtBQUssRUFBSyxJQUFJO0lBQ2QsSUFBSSxFQUFNLEdBQUc7SUFDYixJQUFJLEVBQU0sR0FBRztJQUNiLEtBQUssRUFBSyxJQUFJO0lBQ2QsS0FBSyxFQUFLLElBQUk7SUFDZCxPQUFPLEVBQUcsSUFBSTtJQUNkLEdBQUcsRUFBTyxTQUFTO0lBQ25CLElBQUksRUFBTSxhQUFhO0NBQ3ZCLENBQUEifQ==