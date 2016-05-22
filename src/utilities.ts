export function firstLetterToUpperCase(str: string): string {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function getterFunctionName(str: string): string {
    return 'get' + firstLetterToUpperCase(str)
}

export function setterFunctionName(str: string): string {
    return 'set' + firstLetterToUpperCase(str)
}