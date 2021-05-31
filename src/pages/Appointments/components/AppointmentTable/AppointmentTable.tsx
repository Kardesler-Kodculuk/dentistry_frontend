/* eslint-disable react-hooks/exhaustive-deps */
import {
	TableCell,
	TableHead,
	TableRow,
	TableBody,
	makeStyles,
	Chip,
	IconButton,
} from "@material-ui/core"
import { CustomTable } from "@dentistry/components"
import { useAppointment } from "@dentistry/services"
import { CalculateDuration, CalculateOpenSessions } from "@dentistry/utils"
import { useState, useEffect } from "react"
import { AppointmentInfo } from "@dentistry/interfaces"
import { AppointmentEdit } from "./components"
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
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
	const [edit, setEdit] = useState<AppointmentInfo | null>(null)
	const [open, setOpen] = useState<boolean>(false)
	const head = [
		"Doctor",
		"Operations",
		"Full Name",
		"Date",
		"Session",
		"Communication",
		"Cost",
		"",
		"",
	]
	const handleOpen = () => {
		setOpen(true)
	}
	const handleClose = () => {
		setOpen(false)
	}
	const handleRow = (e: AppointmentInfo) => {
		setEdit(e)
		handleOpen()
	}

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
						<TableRow key={"table_appointment_row_" + i} hover role="button">
							<TableCell>{appointment.doctor?.doctor_name}</TableCell>
							<TableCell>
								{appointment.operations?.map((operation) => (
									<Chip
										className={classes.chip}
										label={operation.diagnosis_name}
										key={"operation_" + operation.diagnosis_id + "_table_appointment_row_" + i}
									/>
								))}
							</TableCell>
							<TableCell>{appointment.patient?.patient_name}</TableCell>
							<TableCell>{appointment.date_.toLocaleDateString("en-GB")}</TableCell>
							<TableCell>{CalculateDuration(appointment, appointments.intervals.values)}</TableCell>
							<TableCell>{appointment.patient?.phone_number}</TableCell>
							<TableCell>
								{"$"+appointment?.operations
									?.map((e) => e.diagnosis_price / 100)
									.reduce((a, b) => a + b, 0)}
							</TableCell>
							<TableCell>
								{appointment.date_.getTime() > new Date().getTime() ? (
									<IconButton onClick={() => handleRow(appointment)}>
										<EditIcon />
									</IconButton>
								) : null}
							</TableCell>
							<TableCell>
								<IconButton
									onClick={() => appointments.deleteAppointment(appointment.appointment_id)}>
									<DeleteIcon />
								</IconButton>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</CustomTable>
			<AppointmentEdit
				editedAppointment={edit}
				open={open}
				handleOpen={handleOpen}
				handleClose={handleClose}
			/>
		</div>
	)
}
