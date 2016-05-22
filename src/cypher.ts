export function matchLabel(label: string) {
    return `match (n:${label})`
}

export function whereId(id: number) {
    return `where id(n)=${id}`
}

export function findModelByIdQuery(label: string, id: number) {
    return `${matchLabel(label)} ${whereId(id)}`
}
