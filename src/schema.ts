export default class Schema {

    label: string
    fields: any
    seraph: any

    constructor(label: string, fields: any) {
        this.label = label
        this.fields = fields
    }

    setSeraph(seraph: any) {
        this.seraph = seraph
    }

}