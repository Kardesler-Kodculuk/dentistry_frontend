import { TableCell, TableHead, TableRow, TableBody, makeStyles, Chip } from "@material-ui/core"
import { CustomTable } from "@dentistry/components"
import { useAppointment } from "@dentistry/services"
import { CalculateDuration } from "@dentistry/utils"
import { useEffect } from "react"
const useStyles = makeStyles((theme) => ({
	head: {
		color: theme.palette.common.white,
		backgroundColor: theme.palette.common.black,
	},
	row: {
		color: theme.palette.common.white,
	},
	chip: {
		margin: theme.spacing(0.2),
	},
}))

export function AppointmentTable() {
	const classes = useStyles()
	const appointments = useAppointment()
	const head = ["Doctor", "Operations", "Full Name", "Date", "Session", "Communication"]

	return (
		<div style={{ height: 700, width: "100%" }}>
			<CustomTable>
				<TableHead>
					<TableRow className={classes.head}>
						{head.map((header, i) => (
							<TableCell className={classes.row} key={"header_row_" + i}>
								{header}
							</TableCell>
						))}
					</TableRow>
				</TableHead>
				<TableBody>
					{appointments?.appointments.values.map((appointment, i) => (
						<TableRow key={"table_appointment_row_" + i}>
							<TableCell>{appointment.doctor?.doctor_name}</TableCell>
							<TableCell>
								{appointment.operations?.map((operation) => (
									<Chip className={classes.chip} label={operation.diagnosis_name} />
								))}
							</TableCell>
							<TableCell>{appointment.patient?.patient_name}</TableCell>
							<TableCell>{appointment.date_.toLocaleDateString("en-GB")}</TableCell>
							<TableCell>{CalculateDuration(appointment, appointments.intervals.values)}</TableCell>
							<TableCell>{appointment.patient?.phone_number}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</CustomTable>
		</div>
	)
}
