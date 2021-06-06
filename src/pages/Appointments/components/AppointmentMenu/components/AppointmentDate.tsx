import { makeStyles } from "@material-ui/core"
import { CustomMenuItem } from "@dentistry/components"
import { useAppointment } from "@dentistry/services"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useState, useEffect } from "react"
import { Box, Switch, FormControlLabel } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(2.5),
		marginRight: theme.spacing(1),
		width: 200,
	},
}))

export function AppointmentDate() {
	const appointment = useAppointment()
	const classes = useStyles()
	const [state, setState] = useState<boolean>(true)
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

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setState(event.target.checked)
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
								if (date) {
									if (date?.getTime() <= appointment?.date.values["end"].getTime()) {
										handleDate("start", date)
									} else {
										handleDate("end", date)
										handleDate("start", date)
									}
								}
							}}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
						<KeyboardDatePicker
							disableToolbar
							variant="inline"
							format="dd/MM/yyyy"
							margin="normal"
							id="date-picker-inline-2"
							label="End Date"
							value={appointment?.date.values["end"]}
							minDate={appointment?.date.values["start"]}
							onChange={(date) => handleDate("end", date)}
							KeyboardButtonProps={{
								"aria-label": "change date",
							}}
						/>
					</MuiPickersUtilsProvider>
				</Box>
			)}
			<Box display="flex" justifyContent="center" marginTop={1} marginBottom={1}>
				<FormControlLabel
					control={
						<Switch checked={state} onChange={handleChange} name="All Dates" color="primary" />
					}
					label="Filter By Date"
				/>
			</Box>
		</CustomMenuItem>
	)
}
