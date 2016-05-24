angular-repository
==================

API Repository factory for Angular Js based on ngResource

## Extending `Entity` class model

We want so that each object existed only **ONCE**, when the JS each object and so it is already a reference.
Because each entity class inherits from the `Entity` (pseudo abstract class because JS has no abstract classes)

And now what's next?
We would if there any property have been changed by the user, they were not changed when updating object API while the other properties unchanged by the user were updated.

Our solution relationships of the objects are working smartly, it references has changed object in one place, it is changing everywhere (in every other variable or property)
And lest it all nicely worked our constructor entities must have a specific structure which ensures that all properties (nested and those by circural reference were updated accordingly)

It looks like:
```javascript
    constructor(parameters = {}, merge = false) {
       let entity = super(parameters, merge);

       this.collection = this.collection || [];
       if (parameters.collection ) {
           for (let i = 0; i < parameters.collection .length; i++) {
               let oterEntity = new OterEntity(parameters.collection [i], merge);
               if (!this.contains(this.collection , oterEntity)) {
                   this.collection .push(oterEntity);
               }
           }
       }
       
       this.oterEntity = parameters.oterEntity;

       if (entity.id) return entity;

       this.id = parameters.id;
       this.name = parameters.name;

       this.watch();
    }

    get oterEntity() {
        return this.getter(OterEntity, this._oterEntity);
    }

    set oterEntity(data) {
        return this._oterEntity = this.setter(data, OterEntity);
    }
```

It is important that at the very beginning (after `super`) to call up the appropriate constructors for nested objects in the example collection and a single object
as it is to look like you probably noticed in the collection is to check whether the object is not already been added (the` push`) teeth not duplicate references in `array`.
Then supposed to be located `if (entity.id) return entity;` that is, so if the object already exists, later assign other properties and at the end of `this.watch ();` that is,
inclusion Watcher on property, when some kind of change is not she later updated by API

**NOTE**: The solution is new and may still possess a lot of mistakes also do not be afraid of them reported at or improve