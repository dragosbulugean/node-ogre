import * as cypher from './cypher'
import * as Fields from './fields'
import * as utilities from './utilities'

export default class Schema {
    
    label: string
    static model: any = {}
    
    constructor() {
    }
    
    findById(label: string, id: number) {
        return cypher.findModelByIdQuery(label, id)
    }
    
    instantiate(): any {
        
        let model = {
            schema: this
        }
        
        for(let f in this) {
            model['label'] = this.label
            let field = this[f]
            model[field] = undefined
            let accesors = field.getAccesors()
            model[utilities.getterFunctionName(field.name)] = accesors.getterFunction
            model[utilities.setterFunctionName(field.name)] = accesors.setterFunction
            model['findById'] = this.findById
        }
        
        if(!Schema.model) Schema.model = model
        return Schema.model
    }
    
}