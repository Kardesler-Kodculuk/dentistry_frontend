export interface Form<T> {
    setValues: (holder: string, value: T) => void
    reset: (newValues: { [key: string]: T; }) => void
    values: { [key: string]: T; }
}