/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment,useLoading } from "@dentistry/services"
import { CustomDialog } from "@dentistry/components"
import { useForm, useArray } from "@dentistry/hooks"
import {
	Box,
	Button,
	TextField,
	FormControl,
	makeStyles,
	Select,
	MenuItem,
	Input,
	Chip,
	Typography,
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useEffect, useState } from "react"
import { CalculateOpenSessions } from "@dentistry/utils"
import { Time } from "@dentistry/interfaces"

const useStyles = makeStyles((theme) => ({
	doubleInput: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 200,
	},
	input: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 400,
	},
	chip: {
		marginLeft: theme.spacing(2),
	},
	warn: {
		color: theme.palette.warning.light,
	},
	empty: {
		color: theme.palette.success.main,
	},
	full: {
		color: theme.palette.secondary.dark,
	},
}))

export function AppointmentAdd() {
	const classes = useStyles()
	const appointment = useAppointment()
	const [open, setOpen] = useState<boolean>(false)
	const [load, setLoad] = useState<boolean>(false)
	const [doctorID, setDoctorID] = useState<number>(0)
	const [operationID, setOperationID] = useState<number[]>([])
	const [startID, setStartID] = useState<number>(0)
	const [endID, setEndID] = useState<number>(0)
	const [slots, setSlots] = useState<{ time: Time; ends: Time[] }[]>([])
	const [doctorSlots, setDoctorSlots] = useState<{ time: Time; ends: Time[] }[][]>([])
	const [slotEnds, setSlotEnds] = useState<Time[]>([])

	const info = useForm<string>({
		initials: {
			name: "",
			cell: "",
			notes: "",
		},
	})

	const date = useForm<Date>({
		initials: {
			date: new Date(),
		},
	})
	useEffect(() => {
		async function emptySlots() {
			let res = appointment?.doctors.values.map((e) =>
				appointment?.emptyTimeSlots(date.values["date"], e.doctor_id)
			)
			if (res !== undefined && appointment?.intervals) {
				let data = await Promise.all(res)
				if (data.length > 0) {
					let sessions = data.map((e) => CalculateOpenSessions(e, appointment?.intervals.values))
					setDoctorSlots(sessions)
				}
			}
		}
		emptySlots()
	}, [date.values, appointment?.appointments.values])

	useEffect(() => {
		async function emptySlots() {
			let res = await appointment?.emptyTimeSlots(date.values["date"], doctorID)
			if (res && appointment?.intervals) {
				setSlots(CalculateOpenSessions(res, appointment?.intervals.values))
			}
		}
		emptySlots()
	}, [date.values, appointment?.appointments.values, doctorID])

	useEffect(() => {
		if (slots.length > 0) {
			setStartID(slots[0].time.time_id)
			setLoad(!load)
		}
	}, [slots])

	useEffect(() => {
		let ends = slots.find((slot) => slot.time.time_id === startID)?.ends
		if (ends !== undefined) {
			setSlotEnds([...ends])
		} else {
			setSlotEnds([])
		}
	}, [startID, load])

	useEffect(() => {
		if (slotEnds[0]) {
			setEndID(slotEnds[0].time_id)
		}
	}, [slotEnds])

	useEffect(() => {
		date.setValues("date", new Date())
	}, [open])

	const addHandler = (e: React.SyntheticEvent): void => {
		e.preventDefault()

		let date_ = new Date(date.values["date"])
		let start = appointment?.intervals.values.find((e) => e.time_id === startID)?.timeValues
		if (start) {
			date_.setHours(start[0], start[1], 0, 0)
			console.log(date_)
			appointment?.addAppointment(
				doctorID,
				info.values["name"],
				info.values["cell"],
				operationID,
				date_,
				endID - startID,
				info.values["notes"]
			)
		}
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
		setOperationID(event.target.value as number[])
	}

	const handleStart = (event: React.ChangeEvent<{ value: unknown }>) => {
		setStartID(event.target.value as number)
	}
	const handleEnd = (event: React.ChangeEvent<{ value: unknown }>) => {
		setEndID(event.target.value as number)
	}

	const handleOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
		setOperationID([])

		if (appointment && appointment?.doctors?.values.length > 0) {
			setDoctorID(appointment?.doctors.values[0].doctor_id)
		}

		date.reset({
			date: new Date(),
		})
		info.reset({
			name: "",
			cell: "",
			notes: "",
		})
	}

	if (doctorSlots.length !== appointment?.doctors.values.length) {
		return null
	}

	return (
		<div>
			<CustomDialog
				open={open}
				handleClose={handleClose}
				handleOpen={handleOpen}
				componentColor="primary"
				componentName="Add Appointment"
				title="Appointment Information"
				submit={{ value: "Add Appointment", handler: addHandler }}>
				<Box>
					<Box display="flex" alignItems="flex-end">
						<TextField
							required
							className={classes.doubleInput}
							fullWidth
							label="Name"
							value={info.values["name"]}
							onChange={(e) => info.setValues("name", e.target.value)}
						/>
						<TextField
							required
							className={classes.doubleInput}
							fullWidth
							label="Phone Number"
							value={info.values["cell"]}
							onChange={(e) => info.setValues("cell", e.target.value)}
						/>
					</Box>

					<Select
						required
						label="Operations"
						value={operationID}
						onChange={operationHandler}
						className={classes.input}
						multiple>
						{appointment?.operations.values.map((operation) => (
							<MenuItem
								value={operation.diagnosis_id}
								key={"add_operation_selection_" + operation.diagnosis_id}>
								{operation.diagnosis_name}
							</MenuItem>
						))}
					</Select>

					<Box display="flex" alignItems="flex-end">
						<Select
							required
							value={doctorID}
							onChange={doctorHandler}
							className={classes.doubleInput}>
							{appointment?.doctors.values.map((doctor, i) => (
								<MenuItem value={doctor.doctor_id} key={"add_doctor_selection_" + doctor.doctor_id}>
									<Typography
										className={
											doctorSlots[i].length > 9
												? classes.empty
												: doctorSlots[i].length > 0
												? classes.warn
												: classes.full
										}>
										{doctor.doctor_name}
										<Chip size="small" label={doctorSlots[i].length} className={classes.chip} />
									</Typography>
								</MenuItem>
							))}
						</Select>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<KeyboardDatePicker
								minDate={new Date()}
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
					{slots.length > 0 ? (
						<Box display="flex" alignItems="flex-end">
							<Select
								required
								value={startID}
								onChange={handleStart}
								className={classes.doubleInput}>
								{slots.map((slot) => (
									<MenuItem
										value={slot.time.time_id}
										key={"add_session_selection_start_" + slot.time.time_id}>
										{slot.time.name}
										<Chip size="small" label={slot.ends.length} className={classes.chip} />
									</MenuItem>
								))}
							</Select>

							<Select required value={endID} onChange={handleEnd} className={classes.doubleInput}>
								{slotEnds.map((slot) => (
									<MenuItem
										value={slot.time_id}
										key={"add_session_selection_start_" + slot.time_id}>
										{slot.name}
									</MenuItem>
								))}
							</Select>
						</Box>
					) : (
						<Box display="flex" alignItems="flex-end" justifyContent="center" margin={3}>
							No slots left
						</Box>
					)}

					<TextField
						className={classes.input}
						fullWidth
						label="Notes"
						rows={3}
						multiline
						variant="outlined"
						value={info.values["notes"]}
						onChange={(e) => info.setValues("notes", e.target.value)}
					/>
				</Box>
			</CustomDialog>
		</div>
	)
}
