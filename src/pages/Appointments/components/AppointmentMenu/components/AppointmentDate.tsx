import { makeStyles } from "@material-ui/core"
import { CustomMenuItem } from "@dentistry/components"
import { useAppointment } from "@dentistry/services"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useState, useEffect } from "react"
import { Box, Switch, FormControlLabel, Checkbox } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(2.5),
		marginRight: theme.spacing(1),
		width: 200,
	},
	end: {
		width: 170,
	},
}))
type props = {
	reset: boolean
}
export function AppointmentDate(props: props) {
	const appointment = useAppointment()
	const classes = useStyles()
	const [state, setState] = useState<boolean>(true)
	const [interval, setInterval] = useState<boolean>(false)
	const handleDate = (type: string, date: Date | null) => {
		if (date) {
			date.setHours(0, 0, 0, 0)
			appointment?.date.setValues(type, date)
		}
	}
	const clearDate = () => {
		let date = new Date()

		if (appointment?.time.values) {
			date.setHours(
				appointment?.time.values["start"][0],
				appointment?.time.values["start"][1],
				0,
				0
			)
			appointment?.date.setValues("start", new Date(date))
			date.setHours(appointment?.time.values["end"][0], appointment?.time.values["end"][1], 0, 0)
			appointment?.date.setValues("end", new Date(date))
			setInterval(false)
			setState(true)
		}
	}
	useEffect(() => {
		if (appointment?.information) {
			if (!state) {
				appointment?.information.setValues("all", "all")
			} else {
				appointment?.information.setValues("all", "")
			}
		}
	}, [state])

	useEffect(() => {
		clearDate()
	}, [props.reset])

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState(event.target.checked)
	}
	const handleInterval = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInterval(event.target.checked)
		let start = appointment?.date.values["start"]
		let end = appointment?.date.values["end"]
		start?.setHours(0, 0, 0, 0)
		end?.setHours(0, 0, 0, 0)
		if (interval && appointment?.date.values && start?.getTime() !== end?.getTime()) {
			handleDate("end", appointment?.date.values["start"])
		}
	}
	if (!appointment?.date) {
		return null
	}
	return (
		<CustomMenuItem name="Date" clearCallback={clearDate}>
			{!state ? null : (
				<Box className={classes.container} display="flex" justifyContent="center">
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							format="dd/MM/yyyy"
							margin="normal"
							id="date-picker-inline"
							label="Start Date"
							value={appointment?.date.values["start"]}
							onChange={(date) => {
								if (!interval) {
									handleDate("start", date)
									handleDate("end", date)
								} else {
									if (date) {
										if (date?.getTime() <= appointment?.date.values["end"].getTime()) {
											handleDate("start", date)
										} else {
											handleDate("end", date)
											handleDate("start", date)
										}
									}
								}
							}}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
						<Box display="flex" alignContent="flex-end" justifyContent="flex-start">
							<Box display="flex" alignContent="center" justifyContent="center">
								<Checkbox checked={interval} onChange={handleInterval} color="primary" />
							</Box>

							<KeyboardDatePicker
								className={classes.end}
								disabled={!interval}
								disableToolbar
								variant="inline"
								format="dd/MM/yyyy"
								margin="normal"
								id="date-picker-inline-2"
								label="End Date"
								value={appointment?.date.values["end"]}
								onChange={(date) => {
									if (date) {
										if (date?.getTime() >= appointment?.date.values["start"].getTime()) {
											handleDate("end", date)
										} else {
											handleDate("start", date)
											handleDate("end", date)
										}
									}
								}}
								KeyboardButtonProps={{
									"aria-label": "change date",
								}}
							/>
						</Box>
					</MuiPickersUtilsProvider>
				</Box>
			)}
			<Box display="flex" justifyContent="center" marginTop={1} marginBottom={1}>
				<FormControlLabel
					control={
						<Switch checked={state} onChange={handleChange} name="Filter by Date" color="primary" />
					}
					label="Filter by Date"
				/>
			</Box>
		</CustomMenuItem>
	)
}
