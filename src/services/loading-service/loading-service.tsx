import React, { useContext, createContext } from "react"
import { Loading } from "@dentistry/interfaces"
import { CircularProgress, Backdrop, makeStyles } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
}))

type props = {
	children: React.ReactNode
}
export const BackdropContext = createContext<Loading | null>(null)

export const BackdropProvider = (props: props) => {
	const classes = useStyles()

	const [open, setOpen] = React.useState(false)

	const handleClose = () => {
		setOpen(false)
	}
	const handleOpen = () => {
		setOpen(true)
	}

	const value = { open: handleOpen, close: handleClose }

	return (
		<BackdropContext.Provider value={value}>
			{props.children}
			<Backdrop className={classes.backdrop} open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</BackdropContext.Provider>
	)
}

export const useLoading = () => {
	return useContext(BackdropContext)
}
