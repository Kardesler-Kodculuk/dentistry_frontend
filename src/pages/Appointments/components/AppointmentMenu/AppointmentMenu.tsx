import { CustomMenu } from "@dentistry/components"
import {
	AppointmentDate,
	AppointmentSession,
	AppointmentDoctors,
	AppointmentOperations,
	AppointmentInformation,
} from "./components"
import { useState } from "react"
export function AppointmentMenu() {
	return (
		<CustomMenu>
			<AppointmentDate />
			<AppointmentSession />
			<AppointmentDoctors />
			<AppointmentInformation />
			<AppointmentOperations />
		</CustomMenu>
	)
}
