import {Predicate} from './ogre'
import * as _ from 'lodash'

export let matchLabel = (mapName: string, label: string): string => {
    return `match (n:${label})`
}

export let where = (mapName: string): string => {
    return `where ${mapName}.`
}

export let whereId = (mapName: string, id: number): string => {
    return `where id(n)=${id}`
}

export let returnNode = (mapName: string): string => {
    return `return ${mapName}`
}

export let queryByLabelAndId = (label: string, id: number): string => {
    let mapName = 'n'
    return `${matchLabel(mapName, label)} ${whereId(mapName, id)} ${returnNode(mapName)}`
}

export let returnCount = (mapName: string): string => {
    return `return count(${mapName})`
}

export let queryCount = (label: string): string => {
    let mapName = 'n'
    return `${matchLabel(mapName, label)} ${returnCount(mapName)}`
}

export let queryFromPredicates = (label: string, predicates: Predicate[]): string => {
    let mapName = 'n'
    return `${matchLabel(mapName, label)} ${predicatesToString(mapName, predicates)} ${returnNode(mapName)}`
}

export let predicatesToString = (mapName: string, predicates: Predicate[]): string => {
    let predicateStrings: string[] = []
    predicates.forEach(predicate => {
        predicateStrings.push(predicateToString(mapName, predicate))
        if(predicate.continuation) predicateStrings.push(predicate.continuation)
    })
    let lastQueryPart = _.last(predicateStrings)
    if(lastQueryPart.toLowerCase() === 'and' || lastQueryPart.toLocaleLowerCase() === 'or') 
        predicates.splice(-1,1)
    return `where ` + predicateStrings.join(' ')
}

export let predicateToString = (mapName: string, predicate: Predicate): string => {
    let value = _.isString(predicate.value) ? `"${predicate.value}"` : predicate.value
    return `${mapName}.${predicate.field}=${value}`
}

export let relateNodes = (node1Id: number, node2Id: number, type: string) => {
    return `match (n1), (n2) where id(n1)=${node1Id} and id(n2)=${node2Id} \
            create (n1)-[r:${type}]->(n2) return r`
}