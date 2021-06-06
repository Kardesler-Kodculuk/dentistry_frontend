/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { useEffect } from "react"
import { CustomMenuItem } from "@dentistry/components"
import {  TextField, makeStyles, Box } from "@material-ui/core"
const useStyles = makeStyles((theme) => ({
	container: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(2.5),
		marginRight: theme.spacing(1),
		width: 200,
	},
}))
type props = {
	reset: boolean
}
export function AppointmentInformation(props:props) {
	
	const appointment = useAppointment()
	const classes = useStyles()

	useEffect(() => {
		appointment?.information.setValues("name", "")
	}, [props.reset])
	
	return (
		<CustomMenuItem
			name="Information"
			clearCallback={() => {
				appointment?.information.setValues("name", "")
			}}>
			<Box className={classes.container} display="flex" justifyContent="center">
				<TextField
					required
					fullWidth
					label="Name"
					value={appointment?.information.values["name"]}
					onChange={(e) => appointment?.information.setValues("name", e.target.value)}
				/>
			</Box>
		</CustomMenuItem>
	)
}
