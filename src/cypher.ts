export let matchLabel = (varname: string, label: string) => {
    return `match (n:${label})`
}

export let whereId = (varname: string, id: number) => {
    return `where id(n)=${id}`
}

export let returnNode = (varname: string) => {
    return `return ${varname}`
}

export let queryByLabelAndId = (label: string, id: number) =>{
    let varname = 'n'
    return `${matchLabel(varname, label)} ${whereId(varname, id)} ${returnNode(varname)}`
}


