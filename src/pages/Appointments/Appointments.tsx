import { Box, Chip } from "@material-ui/core"
import { AppointmentTable, AppointmentMenu, AppointmentAdd } from "./components"
import { useAppointment } from "@dentistry/services"

export function Appointments() {
	const appointment = useAppointment()

	if (!appointment) {
		return null
	}

	return (
		<div>
			<Box
				display="flex"
				justifyContent="flex-end"
				alignItems="flex-start"
				marginTop={4}
				marginRight={"7%"}>
				<Box marginRight={2}>
					<Chip label={"$" + appointment?.totalCost} />
				</Box>
				<AppointmentAdd />
			</Box>
			<Box display="flex" justifyContent="center" marginTop={2}>
				<AppointmentMenu />
				<AppointmentTable />
			</Box>
		</div>
	)
}
