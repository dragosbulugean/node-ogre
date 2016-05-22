class Relation {
    
}

class OneRelation extends Relation {
    
}

class ManyRelation extends Relation {
    
}

enum FieldTypes {
    string, 
    number,
    OneRelation,
    ManyRelation
}

export default FieldTypes