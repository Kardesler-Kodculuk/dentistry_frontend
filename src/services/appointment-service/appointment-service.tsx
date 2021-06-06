/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "@dentistry/hooks"
import { useArray } from "@dentistry/hooks"
import {
	Time,
	Doctor,
	Operation,
	Appointment,
	timeCmp,
	doctorCmp,
	operationCmp,
	AppointmentInfo,
	AppointmentQuery,
	appointmentCmp,
	Patient,
} from "@dentistry/interfaces"
import { useQuery, useLoading } from "@dentistry/services"
import { useContext, createContext, useEffect, useState } from "react"
import { useSnackbar } from "notistack"

export const AppointmentContext = createContext<Appointment | null>(null)

type props = {
	children: React.ReactNode
}

export function AppointmentProvider(props: props) {
	const loading = useLoading()
	const query = useQuery()
	const alert = useSnackbar()
	const [queryString, setQueryString] = useState<string[]>([])
	const [queryStringLoad, setQueryStringLoad] = useState<boolean>(false)
	const [queryLoad, setQueryLoad] = useState<boolean>(false)
	const [totalCost, setTotalCost] = useState<number>(0)
	const [reset, setReset] = useState<boolean>(false)
	const intervals = useArray<Time>({ compare: timeCmp })
	const doctors = useArray<Doctor>({ compare: doctorCmp })
	const operations = useArray<Operation>({ compare: operationCmp })
	const selectedDoctors = useArray<Doctor>({ compare: doctorCmp })
	const selectedOperations = useArray<Operation>({ compare: operationCmp })
	const appointmentQuery = useArray<AppointmentQuery>({ compare: appointmentCmp })
	const appointments = useArray<AppointmentInfo>({ compare: appointmentCmp })

	const information = useForm<string>({
		initials: {
			name: "",
			cell: "",
			all: "",
		},
	})

	const date = useForm<Date>({
		initials: {
			start: new Date(),
			end: new Date(),
			start_end: new Date(),
		},
	})

	const time = useForm<[number, number]>({
		initials: {
			start: [0, 0],
			end: [0, 0],
		},
	})

	useEffect(() => {
		async function fetch() {
			loading?.open()
			intervals.clear()
			doctors.clear()
			operations.clear()
			if (query) {
				const sessionValues: Time[] = []
				let start = 830
				const end = 1800
				for (let i = 0; start < end; i++) {
					sessionValues.push({
						time_id: i,
						name: `${(start / 100).toFixed(0)}:${start % 100 === 0 ? "00" : "30"}`,
						timeValues: [Number((start / 100).toFixed(0)), start % 100],
					})
					start = start % 100 === 30 ? start + 70 : start + 30
				}
				intervals.addValues(sessionValues)
				await query.get<Doctor[]>("doctors").then((data) => doctors.addValues(data))
				await query.get<Operation[]>("diagnosis").then((data) => operations.addValues(data))
			}
			loading?.close()
		}
		fetch()
	}, [query])

	useEffect(() => {
		setQueryStringLoad(false)
		let start = date.values["start"]
		start.setHours(time.values["start"][0], time.values["start"][1], 0, 0)
		date.setValues("start", start)
	}, [time.values["start"]])

	useEffect(() => {
		setQueryStringLoad(false)
		let end = date.values["end"]
		end.setHours(time.values["end"][0], time.values["end"][1], 0, 0)
		date.setValues("end", end)
	}, [time.values["end"]])

	useEffect(() => {
		setQueryStringLoad(false)
	}, [selectedDoctors.values])

	useEffect(() => {
		setQueryStringLoad(false)
	}, [selectedOperations.values])

	useEffect(() => {
		async function createStrings() {
			loading?.open()
			setQueryString([])
			appointmentQuery.clear()
			appointments.clear()
			setQueryLoad(false)
			let queryStrings = []
			let start = new Date(date.values["start"])
			start.setHours(time.values["start"][0], time.values["start"][1], 0, 0)
			let end = new Date(date.values["start"])
			end.setHours(time.values["end"][0], time.values["end"][1], 0, 0)
			let absEnd = new Date(date.values["end"])
			absEnd.setDate(absEnd.getDate() + 1)
			while (end < absEnd) {
				let queryString = `?`
				if (information.values["all"] === "") {
					queryString += `start_date=${start.getTime() / 1000}&stop_date=${end.getTime() / 1000}`
				}
				if (selectedDoctors.values.length > 0) {
					queryString += `&doctor_id=${selectedDoctors.values
						.map((doctor) => doctor.doctor_id)
						.join("%")}`
				}
				if (selectedOperations.values.length > 0) {
					queryString += `&diagnosis_ids=${selectedOperations.values
						.map((operation) => operation.diagnosis_id)
						.join("%")}`
				}
				if (information.values["name"] !== "") {
					queryString += `&patient_name=${escape(information.values["name"])}`
				}

				queryStrings.push(queryString)
				if (information.values["all"] !== "") {
					break
				}
				start = new Date(start)
				start.setDate(start.getDate() + 1)
				end = new Date(end)
				end.setDate(end.getDate() + 1)
			}
			setQueryString(queryStrings)
			setQueryStringLoad(true)
		}
		createStrings()
	}, [
		time.values,
		date.values,
		information.values,
		selectedOperations.values,
		selectedDoctors.values,
		reset,
	])
	const fetchTotalCost = async (queryString: string[]) => {
		setTotalCost(0)
		let res = queryString.map(
			async (queryString) =>
				await query?.get<{ cost: number }>("costs" + queryString).then((data) => data)
		)

		let data = await Promise.all(res)
		let sum = data
			.map((c) => Number(c?.cost))
			.reduce((a, b) => {
				return a + b
			})
		if (sum) {
			setTotalCost(sum / 100)
		}
	}

	const fetchQueries = async (queryString: string[]): Promise<AppointmentQuery[]> => {
		let queryData: AppointmentQuery[] = []
		let res = queryString.map(async (queryString) => {
			return await query?.get<number[]>("appointments" + queryString).then((data) => {
				if (typeof data !== "string") {
					return query?.getID<AppointmentQuery>("appointments", data)
				}
				return []
			})
		})
		let data = await Promise.all(res)

		data.map((query) => {
			if (query) {
				queryData = [...queryData, ...query]
			}
			return null
		})
		return queryData
	}
	useEffect(() => {
		async function loadQueries() {
			if (queryStringLoad) {
				appointmentQuery.addValues(await fetchQueries(queryString))
				await fetchTotalCost(queryString)
				setQueryLoad(true)
			}
		}
		loadQueries()
	}, [queryString, queryStringLoad])

	const fetchAppointments = async (queryArr: AppointmentQuery[]) => {
		let res = queryArr.map(async (appointment): Promise<AppointmentInfo> => {
			let info: AppointmentInfo = {
				appointment_id: appointment.appointment_id,
				date_: new Date(appointment.date_ * 1000),
				doctor: doctors.values.find((doctor) => doctor.doctor_id === appointment.doctor_id),
				duration: appointment.duration,
				operations: operations.values.filter((operation) =>
					appointment.diagnosis_ids.includes(operation.diagnosis_id)
				),
				notes: appointment.notes,
				patient: await query
					?.getID<Patient>("patients", [appointment.patient_id])
					.then((data) => data[0]),
			}
			return info
		})
		return await Promise.all(res).then((data) => data)
	}

	useEffect(() => {
		async function fetchAppointment() {
			if (queryLoad) {
				appointments.clear()
				appointments.addValues(await fetchAppointments(appointmentQuery.values))
				loading?.close()
			}
		}
		fetchAppointment()
	}, [appointmentQuery.values, queryLoad])

	const emptyTimeSlots = async (date: Date, doctor: number) => {
		let start = new Date(date)
		start.setHours(1, 0, 0, 0)
		let end = new Date(date)
		end.setHours(23, 0, 0, 0)

		let queryString = `?start_date=${start.getTime() / 1000}&stop_date=${
			end.getTime() / 1000
		}&doctor_id=${doctor}`
		let res = await fetchQueries([queryString])
		let data = await fetchAppointments(res)
		return data
	}

	const createPatient = async (name: string, cell: string) => {
		return query?.postBody<{ patient_id: number }>("patients", {
			patient_name: name,
			phone_number: cell,
		})
	}

	const addAppointment = async (
		doctor_id: number,
		name: string,
		cell: string,
		operation_ids: number[],
		date: Date,
		duration: number,
		notes: string
	) => {
		loading?.open()
		let patient = await createPatient(name, cell)
		if (patient) {
			let id = await query?.postBody<number>("appointments", {
				doctor_id: doctor_id,
				patient_id: patient.patient_id,
				diagnosis_ids: operation_ids,
				date_: date.getTime() / 1000,
				duration: duration,
				notes: notes,
			})

			alert.enqueueSnackbar("Appointment added", { variant: "success" })
			setReset(!reset)
			return id
		}
		loading?.close()
		return -1
	}

	const editAppointment = async (
		id: number,
		doctor_id: number,
		patient_id: number,
		date: Date,
		duration: number,
		notes: string
	) => {
		loading?.open()
		let res = await query?.pathBody<number>("appointments/" + id, {
			doctor_id: doctor_id,
			patient_id: patient_id,
			date_: date.getTime() / 1000,
			duration: duration,
			notes: notes,
		})
		alert.enqueueSnackbar("Appointment edited", { variant: "info" })
		setReset(!reset)
		loading?.close()
		return res
	}
	const deleteAppointment = async (id: number) => {
		loading?.open()
		let res = await query?.deleteID<number>("appointments/" + id)
		alert.enqueueSnackbar("Appointment deleted", { variant: "error" })
		setReset(!reset)
		loading?.close()
		return res
	}
	const value = {
		totalCost,
		emptyTimeSlots,
		addAppointment,
		editAppointment,
		deleteAppointment,
		appointments,
		intervals,
		doctors,
		selectedDoctors,
		operations,
		selectedOperations,
		information,
		date,
		time,
	}

	return <AppointmentContext.Provider value={value}>{props.children}</AppointmentContext.Provider>
}

export const useAppointment = () => {
	return useContext(AppointmentContext)
}
