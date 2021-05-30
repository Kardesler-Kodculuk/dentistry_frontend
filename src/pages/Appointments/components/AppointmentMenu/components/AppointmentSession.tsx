/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { CustomMenuItem } from "@dentistry/components"
import { Select, Input, makeStyles, MenuItem, Box } from "@material-ui/core"
import { useEffect, useState } from "react"
const useStyles = makeStyles((theme) => ({
	selection: {
		margin: theme.spacing(2),
		minWidth: 80,
	},
}))

export function AppointmentSession() {
	const [load, setLoad] = useState(false)
	const classes = useStyles()
	const appointment = useAppointment()
	const [startID, setStartID] = useState<number>(0)
	const [endID, setEndID] = useState<number>(0)

	useEffect(() => {
		if (appointment?.intervals && appointment?.intervals.values.length > 0 && !load) {
			setEndID(appointment?.intervals.values.length - 1)
			setLoad(true)
		}
	}, [appointment?.intervals])

	useEffect(() => {
		if (appointment?.intervals.values[startID]) {
			appointment?.time.setValues("start", appointment?.intervals.values[startID].timeValues)
			if (startID >= endID) {
				setEndID(startID + 1)
			}
		}
	}, [startID])

	useEffect(() => {
		if (appointment?.intervals.values[endID]) {
			appointment?.time.setValues("end", appointment.intervals.values[endID].timeValues)
		}
	}, [endID])

	if (!appointment || !load) {
		return null
	}

	const handleStart = (event: React.ChangeEvent<{ value: unknown }>) => {
		setStartID(event.target.value as number)
	}
	const handleEnd = (event: React.ChangeEvent<{ value: unknown }>) => {
		setEndID(event.target.value as number)
	}
	const clear = () => {
		if (appointment?.intervals) {
			setStartID(0)
			setEndID(appointment?.intervals.values.length - 1)
		}
	}

	return (
		<div>
			<CustomMenuItem name="Session" clearCallback={clear}>
				<Box display="flex" justifyContent="center">
					<Select
						value={startID}
						onChange={handleStart}
						className={classes.selection}>
						{appointment.intervals.values
							.filter(
								(interval, i) => interval.time_id < appointment.intervals.values.length - 1
							)
							.map((interval) => (
								<MenuItem
									value={interval.time_id}
									key={"menu_session_selection_start_" + interval.time_id}>
									{interval.name}
								</MenuItem>
							))}
					</Select>
					<Select
						value={endID}
						onChange={handleEnd}
						className={classes.selection}>
						{appointment.intervals.values
							.filter((session, i) => session.time_id > startID)
							.map((session) => (
								<MenuItem
									value={session.time_id}
									key={"menu_session_selection_end_" + session.time_id}>
									{session.name}
								</MenuItem>
							))}
					</Select>
				</Box>
			</CustomMenuItem>
		</div>
	)
}
