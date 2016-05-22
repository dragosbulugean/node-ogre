import { Model } from './models'

class Ogre {
    
    driver: string
    models: Model[] = []
    
    constructor(driver: string, models: Model[]) {
        this.driver = driver
        this.models.push(models)
    }
    
    addModel(model: Model) {
        this.models.push(model)
    }
    
    validateModels() {
        
    }
    
}