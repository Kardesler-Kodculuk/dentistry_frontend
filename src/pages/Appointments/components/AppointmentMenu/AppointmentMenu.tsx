import { CustomMenu } from "@dentistry/components"
import {
	AppointmentDate,
	AppointmentSession,
	AppointmentDoctors,
	AppointmentOperations,
	AppointmentInformation,
} from "./components"
import {
	ListItem,
	ListItemText,
	Divider,
	ListItemIcon,
	IconButton,
	ListItemSecondaryAction,
} from "@material-ui/core"

import { DeleteSweep } from "@material-ui/icons"
import { useState } from "react"

export function AppointmentMenu() {
	const [reset, setReset] = useState<boolean>(false)
	return (
		<div>
			<CustomMenu>
				<ListItem>
					<ListItemText>Reset All Filters</ListItemText>
					<ListItemIcon>
						<IconButton edge="end" onClick={() => setReset(!reset)}>
							<DeleteSweep />
						</IconButton>
					</ListItemIcon>
					<ListItemSecondaryAction>
						<IconButton edge="end" disabled></IconButton>
					</ListItemSecondaryAction>
				</ListItem>
				<Divider />
				<AppointmentDate reset={reset} />
				<AppointmentSession reset={reset} />
				<AppointmentDoctors reset={reset} />
				<AppointmentInformation reset={reset} />
				<AppointmentOperations reset={reset} />
			</CustomMenu>
		</div>
	)
}
