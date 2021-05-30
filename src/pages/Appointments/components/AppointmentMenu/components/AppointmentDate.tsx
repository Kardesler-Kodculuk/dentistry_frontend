import { makeStyles } from "@material-ui/core"
import { CustomMenuItem } from "@dentistry/components"
import { useAppointment } from "@dentistry/services"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useState } from "react"
import { Box } from "@material-ui/core"
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

	const handleDate = (type: string, date: Date | null) => {
		if (date) {
			date.setHours(0, 0, 0, 0)
			appointment?.date.setValues(type, date)
		}
	}
	const clearDate = () => {
		let date = new Date()
		date.setHours(0, 0, 0, 0)
		appointment?.date.setValues("start", date)
		appointment?.date.setValues("end", date)
	}

	if (!appointment?.date) {
		return null
	}
	return (
		<CustomMenuItem name="Date" clearCallback={clearDate}>
			<Box className={classes.container}  display="flex" justifyContent="center">
				<MuiPickersUtilsProvider utils={DateFnsUtils}>
					<KeyboardDatePicker
						disableToolbar
						variant="inline"
						format="dd/MM/yyyy"
						margin="normal"
						id="date-picker-inline"
						label="Start Date"
						value={appointment?.date.values["start"]}
						onChange={(date) => handleDate("start", date)}
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
		</CustomMenuItem>
	)
}
