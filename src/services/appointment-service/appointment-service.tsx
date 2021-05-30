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
import { useQuery } from "@dentistry/services"
import { FormatListNumbered } from "@material-ui/icons"
import { useContext, createContext, useEffect, useState } from "react"

export const AppointmentContext = createContext<Appointment | null>(null)

type props = {
	children: React.ReactNode
}

export function AppointmentProvider(props: props) {
	const query = useQuery()
	const [queryString, setQueryString] = useState<string[]>([])
	const [queryStringLoad, setQueryStringLoad] = useState<boolean>(false)
	const [queryLoad, setQueryLoad] = useState<boolean>(false)
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
			surname: "",
			cell: "",
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
			query.get<Doctor[]>("doctors").then((data) => doctors.addValues(data))
			query.get<Operation[]>("diagnosis").then((data) => operations.addValues(data))
		}
	}, [query])

	useEffect(() => {
		console.log(operations.values)
	}, [operations.values])

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
		appointmentQuery.clear()
		appointments.clear()
		setQueryLoad(false)
		let queryStrings = []
		let start = new Date(date.values["start"])
		start.setHours(time.values["start"][0], time.values["start"][1], 0, 0)
		let end = new Date(date.values["start"])
		end.setHours(time.values["end"][0], time.values["end"][1], 0, 0)

		while (end <= date.values["end"]) {
			let queryString = `appointments?start_date=${start.getTime() / 1000}&stop_date=${
				end.getTime() / 1000
			}`
			if (selectedDoctors.values.length > 0) {
				queryString += `&doctor_id=${selectedDoctors.values
					.map((doctor) => doctor.doctor_id)
					.join("%")}`
			}
			if (selectedOperations.values.length > 0) {
				queryString += `&diagnosis_id=${selectedOperations.values
					.map((operation) => operation.diagnosis_id)
					.join("%")}`
			}
			queryStrings.push(queryString)

			start = new Date(start)
			end = new Date(end)
			start.setDate(start.getDate() + 1)
			end.setDate(end.getDate() + 1)
			console.log("" + queryString)
		}
		setQueryString(queryStrings)
		setQueryStringLoad(true)
	}, [time.values, date.values, selectedOperations.values, selectedDoctors.values])

	useEffect(() => {
		async function loadQueries() {
			let queryData: AppointmentQuery[] = []
			if (queryStringLoad) {
				let res = queryString.map(async (queryString) => {
					return await query?.get<number[]>(queryString).then((data) => {
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
				appointmentQuery.addValues(queryData)
				setQueryLoad(true)
			}
		}
		loadQueries()
	}, [queryString, queryStringLoad])

	useEffect(() => {
		async function fetchAppointment() {
			if (queryLoad) {
				appointments.clear()
				let res = appointmentQuery.values.map(async (appointment): Promise<AppointmentInfo> => {
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
				await Promise.all(res).then((data) => appointments.addValues(data))
			}
		}
		fetchAppointment()
	}, [appointmentQuery.values, queryLoad])

	const value = {
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
