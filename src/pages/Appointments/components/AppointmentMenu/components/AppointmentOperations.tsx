/* eslint-disable react-hooks/exhaustive-deps */
import { useAppointment } from "@dentistry/services"
import { CustomMenuItem } from "@dentistry/components"
import { Checkbox, ListItem, ListItemText, ListItemSecondaryAction } from "@material-ui/core"
import { Operation } from "@dentistry/interfaces"
export function AppointmentOperations() {
	const appointment = useAppointment()

	const handleOperation = (operation: Operation): void => {
		if (appointment?.selectedOperations.findIndex(operation) === -1) {
			return appointment?.selectedOperations.addValue(operation)
		}
		return appointment?.selectedOperations.removeValue(operation)
	}

	return (
		<CustomMenuItem name="Operations" clearCallback={() => appointment?.selectedOperations.clear()}>
			{appointment?.operations.values.map((operation, i) => (
				<ListItem key={"operation_selection_item" + i}>
					<ListItemText primary={operation.diagnosis_name} />
					<ListItemSecondaryAction>
						<Checkbox
							color="primary"
							edge="end"
							onChange={() => handleOperation(operation)}
							checked={appointment.selectedOperations.findIndex(operation) !== -1}
						/>
					</ListItemSecondaryAction>
				</ListItem>
			))}
		</CustomMenuItem>
	)
}
