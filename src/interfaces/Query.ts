
export interface Query {
    get: <T>(endPoint: string) => Promise<T>
    getID: <T>(endPoint: string, IDList: number[]) => Promise<T[]>
    post: <T>(endPoint: string, ID: number) => Promise<T>
    postBody: <T>(endPoint: string, body: { [key: string]: string | number }) => Promise<T>
}

