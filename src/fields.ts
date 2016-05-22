import * as utilities from './utilities'

interface Accesors {
    getterFunction: Function,
    setterFunction: Function
}

class Field {
    constructor(public name: string) {
        
    }
    
    getAccesors(): Accesors {
        return {
            getterFunction: () => {},
            setterFunction: () => {}
        }    
    }
    
}

class Number extends Field {
   
    value: number
    
    getAccesors(): Accesors {
        let getterFunction = (): number => this.value
        let setterFunction = (value: number): Number => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }
    
}

class Boolean extends Field {
    
    value: boolean
    
    getAccesors(): Accesors {
        let getterFunction = (): boolean => this.value
        let setterFunction = (value: boolean): Boolean => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }

}

class String extends Field {
        
    value: string
    
    getAccesors(): Accesors {
        let getterFunction = (): string => this.value
        let setterFunction = (value: string): String => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }
        
}

class Moment extends Field {
        
    value: Date
    neoValue: number
    
    getAccesors(): Accesors {
        let getterFunction = (): Date => this.value
        let setterFunction = (value: Date): Moment => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }
    
    convertToNeoType() {
        this.neoValue = this.value.getTime()
    }
    
    convertFromNeoType(neo) {
        this.value = new Date(this.neoValue)
    }
    
}

class Array extends Field {
    
    value: string|number[]
    
    getAccesors(): Accesors {
        let getterFunction = (): string|number[] => this.value
        let setterFunction = (value: string|number[]): Array => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }
   
}

class Dictionary extends Field {
     
    value: any
    neoValue: string
    
    getAccesors(): Accesors {
        let getterFunction = (): any => this.value
        let setterFunction = (value: any): Dictionary => {
            this.value = value
            return this
        }
        return {
            getterFunction: getterFunction,
            setterFunction: setterFunction
        }
    }
    
    convertToNeoType() {
        this.neoValue = JSON.stringify(this.value)
    }
    
    convertFromNeoType() {
        this.value = JSON.parse(this.neoValue)
    }
    
}

class Relation extends Field {
    
}

class OneRelation extends Relation {
    
}

class ManyRelation extends Relation {
    
}

enum FieldTypes {
    String, 
    Number,
    Date,
    Array,
    JSON,
    Boolean,
    OneRelation,
    ManyRelation
}

export { 
    Field, Number, Boolean, String, Moment, Array, Dictionary, Relation, OneRelation, ManyRelation
}