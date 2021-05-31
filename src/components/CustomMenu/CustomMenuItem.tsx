import { useState } from "react"

import {
	makeStyles,
	Divider,
	List,
	ListItem,
	ListItemText,
	Collapse,
	ListItemSecondaryAction,
	IconButton,
	ListItemIcon,
} from "@material-ui/core"


import { ExpandLess, ExpandMore, DeleteSweep } from "@material-ui/icons"
const useStyles = makeStyles((theme) => ({
	item: {
		fontSize: "0.7em",
	},
}))

type props = {
	name: string
	children: any
	clearCallback: () => void
}
export function CustomMenuItem(props: props) {
	const classes = useStyles()
	const [open, setOpen] = useState<boolean>(false)

	const handleOpen = () => {
		setOpen(!open)
	}

	return (
		<div>
			<ListItem className={classes.item}>
				<ListItemText primary={props.name} className={classes.item} />
				<ListItemIcon>
					<IconButton edge="end" onClick={props.clearCallback}>
						
						<DeleteSweep />
					</IconButton>
				</ListItemIcon>
				<ListItemSecondaryAction>
					<IconButton edge="end" aria-label="delete" onClick={handleOpen}>
						{!open ? <ExpandLess /> : <ExpandMore />}
					</IconButton>
				</ListItemSecondaryAction>
			</ListItem>
			<Collapse in={open} unmountOnExit>
				<List disablePadding>{props.children}</List>
			</Collapse>
			<Divider />
		</div>
	)
}
