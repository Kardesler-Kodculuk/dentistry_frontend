import { List, Drawer, makeStyles, CssBaseline, Toolbar } from "@material-ui/core"

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
	drawerContainer: {
		overflow: "auto",
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
			<CssBaseline />
			<Drawer
				className={classes.drawer}
				classes={{
					paper: classes.drawerPaper,
				}}
				variant="permanent"
				anchor="left"
				open={true}>
				<Toolbar />
				<div className={classes.drawerContainer}>
					<List dense className={classes.list}>
						{props.children}
					</List>
				</div>
			</Drawer>
		</div>
	)
}
