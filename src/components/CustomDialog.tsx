import React from "react"
import {
	Dialog,
	Button,
	DialogActions,
	DialogTitle,
	DialogContent,
	makeStyles,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 375,
	},
	title: {
		fontSize: 24,
		marginBottom: 12,
	},
	body: {
		fontSize: 18,
	},
	cancel: {
		color: "white",
		fontWeight: 70,
		backgroundColor: "#f44336",
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(2),
		"&:hover": {
			backgroundColor: "#f6685e",
		},
	},
	submit: {
		color: "white",
		backgroundColor: "#4caf50 ",
		marginRight: theme.spacing(2),
		marginLeft: theme.spacing(2),
		"&:hover": {
			backgroundColor: "#6fbf73",
		},
	},
}))

type DialogData = {
	children: any
	title: string
	submit: { value: string; handler: (e: React.SyntheticEvent) => void }
	componentColor: "inherit" | "default" | "primary" | "secondary" | undefined
	componentName: string
	onClick?: Function
}

export function CustomDialog(props: DialogData) {
	const classes = useStyles()
	const [open, setOpen] = React.useState(false)
	const openDialog = () => {
		setOpen(true)
	}

	const closeDialog = () => {
		setOpen(false)
	}

	return (
		<div>
			<Button
				variant="contained"
				color={props.componentColor}
				onClick={() => {
					openDialog()
					if (props.onClick) {
						props?.onClick()
					}
				}}>
				{props.componentName}
			</Button>
			<Dialog open={open} onClose={closeDialog} keepMounted>
				<DialogTitle id="form-dialog-title">{props?.title}</DialogTitle>
				<form onSubmit={props?.submit.handler}>
					<DialogContent>{props.children}</DialogContent>
					<DialogActions>
						<Button onClick={closeDialog} variant="contained" className={classes.cancel}>
							Cancel
						</Button>
						<Button
							variant="contained"
							className={classes.submit}
							onClick={closeDialog}
							type="submit">
							{props?.submit.value}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}
