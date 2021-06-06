import { CustomMenu } from "@dentistry/components"
import {
	AppointmentDate,
	AppointmentSession,
	AppointmentDoctors,
	AppointmentOperations,
	AppointmentInformation,
} from "./components"
import { ListItem, ListItemText, Divider, Box } from "@material-ui/core"

import { useState } from "react"

export function AppointmentMenu() {
	return (
		<CustomMenu>
			<Box display="flex" justifyContent="center" marginBottom={1}>
				<ListItem>
					<ListItemText>
						<Box display="flex" justifyContent="center">
							e-CUBO | Dentistry App
						</Box>
					</ListItemText>
				</ListItem>
			</Box>
			<Divider />
			<AppointmentDate />
			<AppointmentSession />
			<AppointmentDoctors />
			<AppointmentInformation />
			<AppointmentOperations />
		</CustomMenu>
	)
}
