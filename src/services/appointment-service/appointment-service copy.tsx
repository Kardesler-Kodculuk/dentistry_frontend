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
	const [queryString, setQueryString] = useState<string>("")
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
		appointmentQuery.clear()
		let start = date.values["start"]
		start.setHours(time.values["start"][0], time.values["start"][1], 0, 0)
		date.setValues("start", start)
	}, [date.values["start"], time.values["start"]])

	useEffect(() => {
		appointmentQuery.clear()
		let end = date.values["end"]
		end.setHours(time.values["end"][0], time.values["end"][1], 0, 0)
		date.setValues("end", end)
	}, [date.values["end"], time.values["end"]])

	useEffect(() => {
		appointmentQuery.clear()
	}, [selectedDoctors.values])

	useEffect(() => {
		appointmentQuery.clear()
	}, [selectedOperations.values])

	useEffect(() => {
		let queryString = `appointments?start_date=${date.values["start"].getTime() / 1000}&stop_date=${
			date.values["end"].getTime() / 1000
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
		setQueryString(queryString)
	}, [
		date.values["start"],
		[date.values["end"]],
		selectedOperations.values,
		selectedDoctors.values,
	])

	useEffect(() => {
		appointmentQuery.clear()
		query
			?.get<number[]>(queryString)
			.then((data) => {
				if (typeof data !== "string") {
					return query?.getID<AppointmentQuery>("appointments", data)
				}
				return []
			})
			.then((data) => appointmentQuery.addValues(data))
	}, [queryString])

	useEffect(() => {
		async function fetchAppointment() {
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
		fetchAppointment()
	}, [appointmentQuery.values])

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
