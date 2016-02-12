# OGRE - Tutorial

Import needed modules and initialize OGRE

```javascript
var Model = require('../../sources/Model')
var FieldTypes = require('../../sources/FieldTypes')
var Bootstrapper = require('../../sources/Bootstrapper')
var QueryBuilder = require('../../sources/QueryBuilder')
```

#Persisting models

Define models
```javascript
    var Person = new Model('Person', {
      id: {
        type: Number
      },
      firstName: {
        type: String
      },
      lastName: {
        type: String
      },
      isActive: {
        type: Boolean
      },
      siteVisits: {
        type: Number
      },
      jsonData: {
        type: FieldTypes.JSON
      },
      preferredColors: {
        type: FieldTypes.Array
      },
      bornDate: {
        type: Date
      },
      role: {
        type: new FieldTypes.OneRelation({
          to: 'Role',
          relationType: 'has_role'
        })
      },
      car: {
        type: new FieldTypes.OneRelation({
          to: 'Car',
          relationType: 'has'
        })
      },
      locations: {
        type: new FieldTypes.ManyRelation({
          to: 'Location',
          relationType: 'was_in'
        })
      },
      toys: {
        type: new FieldTypes.ManyRelation({
          to: 'Toy',
          relationType: 'has'
        })
      }
    })

    var Role = new Model('Role', {
      id: {
        type: Number
      },
      description: {
        type: String
      }
    })

    var Car = new Model('Car', {
      id: {
        type: Number
      },
      name: {
        type: String
      }
    })

    var Location = new Model('Location', {
      id: {
        type: Number
      },
      coord: {
        type: String
      }
    })

    var Toy = new Model('Toy', {
      id: {
        type: Number
      },
      name: {
        type: String
      }
    })
```


Bootstrap models

```javascript
var db = {
	server: "http://localhost:7474",
	user: "your_username",
	pass: "your_pass"
}
var bs = new Bootstrapper([Person, Role, Location, Toy, Car])
bs.db(db).initialize()
```

Initialize and save some models

```javascript
var person = Person.instantiate()
person.firstName = 'Henry'          //setter
person.set('lastName', 'Ford')      //alternative setter
person.isActive = true
person.siteVisits = 0
person.jsonData = {x:1,y:2}
person.preferredColors = ['black','yellow','white']
person.bornDate = new Date()       //Date or moment.js instance
//All operations are done through promises
//so expect to do this then-catch everytime you do something
person.persistSelf()
  .then(function(p){
    console.log('We have saved the model as a node into Neo4j.')
  })
  .catch(function(err){
    console.log('Something went wrong')
  })
```


Initialize relationed models

```javascript
var role = Role.instantiate({description:'VP of Engineering'})
```

Saves automatically both the relation and the relationed model, in this case role

```javascript
  person.role = role
  person.save()
```

Initialize more relationed models

```javascript
var location1 = Location.instantiate({coord: 'random string1'})
var location2 = Location.instantiate({coord: 'random string2'})
person.locations.push(location1)
person.locations.push(location2)
person.save()
```

Save without any parameter saves all the relations it has you can save only some relations through these methods

```javascript
var car = Car.instantiate({name: 'Honda'})
person.car = car
person.save(['car'])
```


is the same as

```javascript
person.persistOneRelation('car')
```

For many relations

```javascript
var toy1 = Toy.instantiate({name: 'jerry'})
var toy2 = Toy.instantiate({name: 'tom'})
person.toys = [toy1, toy2]
person.save('toys')
```


is the same as

```javascript
person.persistManyRelation('toys')
```

Lets delete some models. remove() is a soft delete (just renames the label of the node in Neo4j to _ + OriginalLabel)

```javascript
person.remove()
```

The method hardRemove() deletes it completely from the db

```javascript
person.hardRemove()
```

#Querying models

Lets find some people

```javascript
Person.findAll()
  .then(function(people){
    console.log(people)
    //we now have all the people in the db
    //this method is very dangerous if you have alot of elements in the db
    //dont use this
  })
```

Other querying methods
Assuming you have the id of the node you want
findById always returns a single node, or rejects the promise if no node is found

```javascript
Person.findById(id)
  .then(function(person){
    console.log('we found the person with the supplied id')
  })
  .catch(function(err){
    console.log('no person found with the supplied id')
  })
```


This method returns 0 or more Person models

```javascript
Person.findByIdArray([id1,id2,id3])
```

Lets do some filtering

This code brings back all the Toy models with 'jerry' as name
can take multiple fields as parameters

```javascript
Toy.findByExample({name: 'jerry'})
```

The most advanced queries can be done with a QueryBuilder instance

```javascript
var qb = new QueryBuilder()
```

Lets paginate

```javascript
qb.skip(5).limit(20)
Toy.findByQueryBuilder(qb)
```

Lets find by id with qb

```javascript
qb.id(suppliedId)
Toy.findByQueryBuilder(qb)
```

Lets find by id array with qb

```javascript
qb.idArray([id1,id2,id3])
Toy.findByQueryBuilder(qb)
```

Lets filter with qb -- make a clause. Find full list of operators in Constants.js

```javascript
var where1 = {
  operator: 'eq',
  field: 'firstName',
  value: 'Henry'
}
var where2 = {
  operator: 'lt',
  field: 'siteVisits',
  value: 4
}
```


QueryBuilder is chainable

```javascript
qb.addWhere(where1).addWhere(where2, 'AND').limit(5).skip(5)
```

Finds the second group of 5 people with name Henry that visited less than 4 times

```javascript
Person.findByQueryBuilder(qb)
```

Lets order data

```javascript
qb.addOrderBy({field:'firstName', direction: 'DESC'})
Person.findByQueryBuilder(qb)
```

All of these finders on the Model can take a second and a third parameter
The second is called selectList and it specifies which are the fields of the model that
should be brought
The third parameter is called embedList and it specifies which are the relations of the model
that should be brought

```javascript
Person.findById(id, ['firstName', 'isActive'], ['role', 'locations'])
  .then(function(person){
    //person now has id, firstName, isActive, role and locations
  })
```


QueryBuilder can be manipulated to do the same

```javascript
qb.id(id).selectList(['firstName', 'isActive']).embedList(['role', 'locations'])
Person.findByQueryBuilder(qb)
```


Lets make a really complicated query -- which cannot be done with QueryBuilder

```javascript
var query = ['MATCH (n:Person)',
             'WHERE NOT MATCH (n)--() return n'].join(' ')
Person.findByQueryString(query)
```


Lets see how many nodes of a certain type we have in the db

```javascript
Person.count().then(function(nr){
  //we have the number of all person nodes
})
```

So all of these querying methods bring back an instance or collection of instances
of ogre models. To convert them to simple JS objects import

```javascript
var Serializer = require('../../sources/Serializer')
Person.findById(id)
  .then(function(person){
    var jsObject = Serializer.serializeModel(person)
  })
Person.findByIdArray(ids)
  .then(function(person){
    var jsObject = Serializer.serializeModels(person)
  })
```

Please refer to the integration tests code if you want more examples.
