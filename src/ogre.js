"use strict";
class Ogre {
    constructor(driver, models) {
        this.models = [];
        this.driver = driver;
        this.models.push(models);
    }
    addModel(model) {
        this.models.push(model);
    }
    validateModels() {
    }
}
