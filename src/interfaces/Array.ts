export interface Array<T> {
    values: T[]
    addValue: (value: T) => void
    addValues: (value: T[]) => void
    removeValue: (value: T) => void
    findIndex: (value: T) => number
    clear: () => void
}