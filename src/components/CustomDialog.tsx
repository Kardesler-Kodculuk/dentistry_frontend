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
	noButton?: true
	submit: { value: string; handler: (e: React.SyntheticEvent) => void }
	componentColor: "inherit" | "default" | "primary" | "secondary" | undefined
	componentName: string
	onClick?: Function
	open?: boolean | undefined
	handleOpen?: () => void
	handleClose?: () => void
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
			{props.noButton ? null : (
				<Button
					variant="contained"
					color={props.componentColor}
					onClick={() => {
						if (props.handleOpen) {
							props.handleOpen()
						} else {
							openDialog()
						}
						if (props.onClick) {
							props?.onClick()
						}
					}}>
					{props.componentName}
				</Button>
			)}

			<Dialog open={props.open || open} onClose={props.handleClose || closeDialog} keepMounted>
				<DialogTitle id="form-dialog-title">{props?.title}</DialogTitle>
				<form
					onSubmit={(e) => {
						props?.submit.handler(e)
						if (props.handleClose) {
							props.handleClose()
						} else {
							closeDialog()
						}
					}}>
					<DialogContent>{props.children}</DialogContent>
					<DialogActions>
						<Button
							onClick={props.handleClose || closeDialog}
							variant="contained"
							className={classes.cancel}>
							Cancel
						</Button>
						<Button variant="contained" className={classes.submit} type="submit">
							{props?.submit.value}
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	)
}
