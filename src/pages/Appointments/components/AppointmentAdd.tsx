/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { CustomDialog } from "@dentistry/components"
import { useForm } from "@dentistry/hooks"
import {
	Box,
	Button,
	TextField,
	FormControl,
	makeStyles,
	Select,
	MenuItem,
	Input,
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useEffect, useState } from "react"
const useStyles = makeStyles((theme) => ({
	doubleInput: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 170,
	},
	input: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 350,
	},
}))
export function AppointmentAdd() {
	const classes = useStyles()
	const appointment = useAppointment()

	const [doctorID, setDoctorID] = useState<number>(0)
	const [operationID, setOperationID] = useState<number>(0)

	const info = useForm<string>({
		initials: {
			name: "",
			surname: "",
			cell: "",
			notes: "",
		},
	})

	const date = useForm<Date>({
		initials: {
			date: new Date(),
		},
	})

	const addHandler = (e: React.SyntheticEvent): void => {
		e.preventDefault()
	}
	const dateHandler = (value: Date | null) => {
		if (value) {
			value.setHours(0, 0, 0, 0)
			date.setValues("date", value)
		}
	}
	const doctorHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
		setDoctorID(event.target.value as number)
	}
	const operationHandler = (event: React.ChangeEvent<{ value: unknown }>) => {
		setOperationID(event.target.value as number)
	}

	return (
		<div>
			<CustomDialog
				componentColor="primary"
				componentName="Add Appointment"
				title="Appointment Information"
				submit={{ value: "Add Appointment", handler: addHandler }}>
					<Box>
						<Box display="flex" alignItems="flex-end">
							<TextField className={classes.doubleInput} fullWidth label="Name" />
							<TextField className={classes.doubleInput} fullWidth label="Surname" />
						</Box>
						<TextField className={classes.input} fullWidth label="Cell" />
						<Box display="flex">
							<Select
								value={doctorID}
								onChange={doctorHandler}
								className={classes.doubleInput}>
								{appointment?.doctors.values.map((doctor) => (
									<MenuItem
										value={doctor.doctor_id}
										key={"add_doctor_selection_" + doctor.doctor_id}>
										{doctor.doctor_name}
									</MenuItem>
								))}
							</Select>

							<Select
								value={operationID}
								onChange={operationHandler}
								className={classes.doubleInput}>
								{appointment?.operations.values.map((operation) => (
									<MenuItem
										value={operation.diagnosis_id}
										key={"add_operation_selection_" + operation.diagnosis_id}>
										{operation.diagnosis_name}
									</MenuItem>
								))}
							</Select>
						</Box>
						<Box display="flex" alignItems="flex-end">
							<MuiPickersUtilsProvider utils={DateFnsUtils}>
								<KeyboardDatePicker
									className={classes.doubleInput}
									disableToolbar
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline3"
									value={date.values["date"]}
									onChange={dateHandler}
									KeyboardButtonProps={{
										"aria-label": "change date",
									}}
								/>
							</MuiPickersUtilsProvider>
						</Box>
						<TextField
							className={classes.input}
							fullWidth
							label="Notes"
							rows={3}
							multiline
							variant="outlined"
						/>
					</Box>
			</CustomDialog>
		</div>
	)
}
