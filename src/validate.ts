import * as _ from "lodash"

export let string = (keyType, value) => {
    let passed = true
    if(keyType === String)
        if(!_.isString(value)) 
            passed = false
    return passed
}

export let number = (keyType, value) => {
    let passed = true
    if(keyType === Number)
        if(!_.isNumber(value)) 
            passed = false
    return passed    
}