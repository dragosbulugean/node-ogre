import * as _ from "lodash"

export let validateField = (keyType, value) => {
    let passed = true
    if(keyType === String) {
        if(!_.isString(value)) passed = false
    } else if(keyType === Number) {
        if(!_.isNumber(value)) passed = false
    } else if(keyType === Boolean) { 
        if(!_.isBoolean(value)) passed = false
    } else if(keyType === Date) { 
        if(!_.isDate(value)) passed = false
    } else if(_.isArray(keyType)) {
        if(keyType[0] === String) {
            passed = _.every(value, i => _.isString(i) ? true : false)
        } else if(keyType[0] === Number) {
            passed = _.every(value, i => _.isNumber(i) ? true : false)
        } else if(keyType[0] === Boolean) {
            passed = _.every(value, i => _.isBoolean(i) ? true : false)
        } else {
            passed = false
        }
    } else if(keyType === JSON) { 
        if(!_.isObject(value)) passed = false
    }
    return passed
}

//TODO change this -- method does multiple things
export let validateDataFromDbAndConvert = (keyType, value) => {
    let passed = true
    if(keyType === String) {
        if(!_.isString(value)) passed = false
    } else if(keyType === Number) {
        if(!_.isNumber(value)) passed = false
    } else if(keyType === Boolean) { 
        if(!_.isBoolean(value)) passed = false
    } else if(keyType === Date) {
        value = new Date(value)
        if(!_.isDate(value)) passed = false
    } else if(_.isArray(keyType)) {
        if(keyType[0] !== String && keyType[0] !== Number && keyType[0] !== Boolean) passed = false
    } else {
        value = JSON.parse(value)
    }
    return [passed, value]
}
