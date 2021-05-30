/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { CustomMenuItem } from "@dentistry/components"
import {
	Checkbox,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
} from "@material-ui/core"
import { Doctor } from "@dentistry/interfaces"
export function AppointmentDoctors() {
	const appointment = useAppointment()

	const handleDoctors = (doctor: Doctor): void => {
		if (appointment?.selectedDoctors.findIndex(doctor) === -1) {
			return appointment?.selectedDoctors.addValue(doctor)
		}
		return appointment?.selectedDoctors.removeValue(doctor)
	}

	return (
		<CustomMenuItem name="Doctors" clearCallback={() => appointment?.selectedDoctors.clear()}>
			{appointment?.doctors.values.map((doctor, i) => (
				<ListItem key={"doctor_selection_item_" + i}>
					<ListItemText primary={doctor.doctor_name} />
					<ListItemSecondaryAction>
						<Checkbox
							color="primary"
							edge="end"
							onChange={() => handleDoctors(doctor)}
							checked={appointment.selectedDoctors.findIndex(doctor) !== -1}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</CustomMenuItem>
	)
}
