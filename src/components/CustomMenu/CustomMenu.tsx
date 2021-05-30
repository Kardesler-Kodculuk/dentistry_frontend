import { List, Drawer, makeStyles } from "@material-ui/core"

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},

	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	list: {
		width: "100%",
		fontSize: 22,
	},
	control: {
		padding: 5,
		maxWidth: drawerWidth / 3,
	},
}))
type props = {
	children: any
}
export function CustomMenu(props: props) {
	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Drawer
				className={classes.drawer}
				classes={{
					paper: classes.drawerPaper,
				}}
				variant="persistent"
				anchor="left"
				open={true}>
				<List dense className={classes.list}>
					{props.children}
				</List>
			</Drawer>
		</div>
	)
}
