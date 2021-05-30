import { Box } from "@material-ui/core"
import { AppointmentTable, AppointmentMenu, AppointmentAdd } from "./components"

export function Appointments() {
	return (

		<div>
			<Box display="flex" justifyContent="flex-end" alignItems="flex-start" marginTop={4} marginRight={"7%"}>
				<AppointmentAdd />
			</Box>
			<Box display="flex" justifyContent="center" marginTop={2}>
				<AppointmentMenu />
				<AppointmentTable />
			</Box>
		</div>
	)
}
