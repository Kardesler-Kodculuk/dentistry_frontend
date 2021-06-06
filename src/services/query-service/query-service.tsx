import React, { useContext, createContext } from "react"
import axios, { AxiosResponse } from "axios"
import { Query } from "@dentistry/interfaces"
import { API } from "@dentistry/utils"

type props = {
	children: React.ReactNode
}
export const QueryContext = createContext<Query | null>(null)

export async function get<T>(endPoint: string): Promise<T> {
	return await axios
		.get<Promise<T>>(`${API?.url}${endPoint}`, { withCredentials: true })
		.then((res) => res.data)
}

export async function getID<T>(endPoint: string, IDList: number[]): Promise<T[]> {
	if (IDList.length > 0) {
		let request: Promise<AxiosResponse<T>>[] = IDList.map((id) =>
			axios.get<T>(`${API?.url}${endPoint}/${id}`, { withCredentials: true })
		)
		return await axios.all([...request]).then(axios.spread((...res) => res.map((r) => r.data)))
	}
	return []
}

export async function post<T>(endPoint: string, ID: number | string): Promise<T> {
	return await axios
		.post<Promise<T>>(`${API?.url}${endPoint}/${ID}`, { withCredentials: true })
		.then((res) => res.data)
}

export async function deleteID<T>(endPoint: string): Promise<T> {
	return await axios
		.delete<Promise<T>>(`${API?.url}${endPoint}`, { withCredentials: true })
		.then((res) => res.data)
}
export async function pathBody<T>(
	endPoint: string,
	body: { [key: string]: string | number[] | number }
): Promise<T> {
	return await axios
		.patch<Promise<T>>(`${API?.url}${endPoint}`, body, { withCredentials: true })
		.then((res) => res.data)
}

export async function postBody<T>(
	endPoint: string,
	body: { [key: string]: string | number[] | number }
): Promise<T> {
	return await axios
		.post<Promise<T>>(`${API?.url}${endPoint}`, body, { withCredentials: true })
		.then((res) => res.data)
}

export const QueryProvider = (props: props) => {
	const value: Query = {
		get,
		getID,
		post,
		postBody,
		deleteID,
		pathBody,
	}

	return <QueryContext.Provider value={value}>{props.children}</QueryContext.Provider>
}

export const useQuery = () => {
	return useContext(QueryContext)
}
