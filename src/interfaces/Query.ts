
export interface Query {
    get: <T>(endPoint: string) => Promise<T>
    getID: <T>(endPoint: string, IDList: number[]) => Promise<T[]>
    post: <T>(endPoint: string, ID: number | string) => Promise<T>
    postBody: <T>(endPoint: string, body: { [key: string]: string | number[] | number }) => Promise<T>
    deleteID<T>(endPoint: string): Promise<T>
    pathBody<T>(endPoint: string, body: { [key: string]: string | number[] | number }): Promise<T>
}

