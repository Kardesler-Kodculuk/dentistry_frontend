/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { AppointmentInfo } from "@dentistry/interfaces"
import { CustomDialog } from "@dentistry/components"
import { useForm } from "@dentistry/hooks"
import {
	Box,
	TextField,
	makeStyles,
	Select,
	MenuItem,
	Chip,
	CircularProgress,
} from "@material-ui/core"
import DateFnsUtils from "@date-io/date-fns"
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import { useEffect, useState } from "react"
import { CalculateOpenSessions, CalculateDuration } from "@dentistry/utils"
import { Time } from "@dentistry/interfaces"
const useStyles = makeStyles((theme) => ({
	doubleInput: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 215,
	},
	input: {
		display: "flex",
		flexWrap: "wrap",
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		marginBottom: theme.spacing(2),
		width: 430,
	},
	chip: {
		marginLeft: theme.spacing(1),
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
	loading: {
		color: "#fff",
	},
}))

type props = {
	open: boolean
	handleOpen: () => void
	handleClose: () => void
	editedAppointment: AppointmentInfo | null
}

export function AppointmentEdit(props: props) {
	const classes = useStyles()
	const appointment = useAppointment()
	const [open, setOpen] = useState<boolean>(false)
	const [current, setCurrent] = useState<string>("")
	const [load, setLoad] = useState<boolean>(false)
	const [start, setStart] = useState<{ time: Time; ends: Time[] } | undefined>()
	const [doctorID, setDoctorID] = useState<number>(0)
	const [operationID, setOperationID] = useState<number[]>([])
	const [startID, setStartID] = useState<number>(0)
	const [endID, setEndID] = useState<number>(0)
	const [slots, setSlots] = useState<{ time: Time; ends: Time[] }[]>([])
	const [doctorSlots, setDoctorSlots] = useState<{ time: Time; ends: Time[] }[][]>([])
	const [slotEnds, setSlotEnds] = useState<Time[]>([])
	const [loading, setLoading] = useState<boolean>(false)
	const [loading_, setLoading_] = useState<boolean>(false)

	const info = useForm<string>({
		initials: {
			name: "",
			cell: "",
			notes: "",
			price: "",
		},
	})

	const date = useForm<Date>({
		initials: {
			date: new Date(),
		},
	})

	useEffect(() => {
		if (
			props.editedAppointment &&
			props.editedAppointment.patient &&
			props.editedAppointment.doctor &&
			props.editedAppointment.operations &&
			appointment?.intervals
		) {
			let curr = CalculateDuration(props.editedAppointment, appointment?.intervals.values)
			if (curr) {
				setCurrent(curr)
			}
			info.setValues("name", "" + props.editedAppointment.patient?.patient_name)
			info.setValues("cell", "" + props.editedAppointment.patient?.phone_number)
			info.setValues("notes", "" + props.editedAppointment.notes)
			info.setValues(
				"price",
				"$ " +
					props.editedAppointment.operations
						.map((e) => e.diagnosis_price)
						.reduce((a, b) => a + b, 0) /
						100
			)
			date.setValues("date", new Date(props.editedAppointment.date_))
			setDoctorID(props.editedAppointment.doctor?.doctor_id)
			setOperationID([...props.editedAppointment.operations.map((e) => e.diagnosis_id)])
			setLoad(!load)
		}
	}, [props.editedAppointment])

	useEffect(() => {
		async function emptySlots() {
			setLoading(true)
			let res = appointment?.doctors.values.map((e) =>
				appointment?.emptyTimeSlots(date.values["date"], e.doctor_id)
			)

			if (res !== undefined && appointment?.intervals && props.editedAppointment !== null) {
				let data = await Promise.all(res)
				if (data.length > 0 && props.editedAppointment) {
					let sessions: { time: Time; ends: Time[] }[][] = []
					data.forEach((e) => {
						if (props.editedAppointment) {
							sessions.push(
								CalculateOpenSessions(e, appointment?.intervals.values, props.editedAppointment)
							)
						}
					})
					setDoctorSlots(sessions)
				}
			}
			setLoading(false)
		}
		emptySlots()
	}, [date.values, appointment?.appointments.values])

	useEffect(() => {
		async function emptySlots() {
			setLoading_(true)
			let res = await appointment?.emptyTimeSlots(date.values["date"], doctorID)
			if (res && appointment?.intervals && props.editedAppointment) {
				setSlots(CalculateOpenSessions(res, appointment?.intervals.values, props.editedAppointment))
			}
			setLoading_(false)
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

	const editHandler = (e: React.SyntheticEvent): void => {
		e.preventDefault()

		let date_ = new Date(date.values["date"])
		let start = appointment?.intervals.values.find((e) => e.time_id === startID)?.timeValues

		if (start && props.editedAppointment && props.editedAppointment?.patient) {
			date_.setHours(start[0], start[1], 0, 0)
			appointment?.editAppointment(
				props.editedAppointment?.appointment_id,
				doctorID,
				props.editedAppointment?.patient?.patient_id,
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

	return (
		<CustomDialog
			noButton
			open={props.open}
			handleOpen={props.handleOpen}
			handleClose={props.handleClose}
			componentColor="primary"
			componentName={props.editedAppointment?.patient?.patient_name + "'s Appointment"}
			title={props.editedAppointment?.patient?.patient_name + "'s Appointment"}
			submit={{ value: "Edit", handler: editHandler }}>
			{loading || loading_ || doctorSlots.length !== appointment?.doctors.values.length ? (
				<Box display="flex" justifyContent="center" alignContent="center" marginBottom={3}>
					<CircularProgress color="inherit" />
				</Box>
			) : (
				<Box>
					<Box>
						<Box display="flex" alignItems="flex-end">
							<TextField
								className={classes.doubleInput}
								fullWidth
								disabled
								label="Name"
								value={info.values["name"]}
								onChange={(e) => info.setValues("name", e.target.value)}
							/>
							<TextField
								className={classes.doubleInput}
								fullWidth
								disabled
								label="Phone Number"
								value={info.values["cell"]}
								onChange={(e) => info.setValues("cell", e.target.value)}
							/>
						</Box>

						<Select
							disabled
							label="Operations"
							value={operationID}
							onChange={operationHandler}
							className={classes.input}
							multiple>
							{appointment?.operations.values.map((operation) => (
								<MenuItem
									value={operation.diagnosis_id}
									key={"edit_operation_selection_" + operation.diagnosis_id}>
									{operation.diagnosis_name}
								</MenuItem>
							))}
						</Select>
						<Box display="flex" alignItems="flex-end">
							<Select
								value={doctorID}
								label="Doctor"
								onChange={doctorHandler}
								className={classes.doubleInput}>
								{appointment?.doctors.values.map((doctor, i) => (
									<MenuItem
										value={doctor.doctor_id}
										key={"edit_doctor_selection_" + doctor.doctor_id}>
										<Box
											className={
												doctorSlots[i].length > 9
													? classes.empty
													: doctorSlots[i].length > 0
													? classes.warn
													: classes.full
											}>
											{doctor.doctor_name}
											<Chip size="small" label={doctorSlots[i].length} className={classes.chip} />
										</Box>
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
									id="date-picker-inline4"
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
								No slots left Today
							</Box>
						)}
						<Box display="flex" alignItems="flex-end">
							<TextField
								disabled
								className={classes.doubleInput}
								fullWidth
								label="Price"
								value={info.values["price"]}
								onChange={(e) => info.setValues("price", e.target.value)}
							/>
							{current !== "" ? (
								<TextField
									disabled
									className={classes.doubleInput}
									fullWidth
									label="Current Time"
									value={current}
								/>
							) : null}
						</Box>

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
				</Box>
			)}
		</CustomDialog>
	)
}
