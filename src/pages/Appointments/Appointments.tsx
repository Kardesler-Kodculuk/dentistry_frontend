import {
	Box,
	Chip,
	makeStyles,
	AppBar,
	Toolbar,
	Typography,
	CssBaseline,
	Container,
} from "@material-ui/core"
import { AppointmentTable, AppointmentMenu, AppointmentAdd } from "./components"
import { useAppointment } from "@dentistry/services"
import AttachMoneyIcon from "@material-ui/icons/AttachMoney"


const useStyles = makeStyles((theme) => ({
	root: {
		display: "flex",
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
	},
	title: {
		flexGrow: 1,
	},
	leftBar: {
		marginRight: theme.spacing(2),
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	},
}))

export function Appointments() {
	const classes = useStyles()
	const appointment = useAppointment()

	if (!appointment) {
		return null
	}

	return (
		<Container>
			<CssBaseline />
			<Box display="flex" justifyContent="center" marginTop={10}>
				<AppBar position="fixed" className={classes.appBar}>
					<Toolbar>
						<Typography variant="h6" className={classes.title} noWrap>
							e-KUBO | Dentistry App
						</Typography>
						<div className={classes.leftBar}>
							<Chip
								style={{ backgroundColor: "white" }}
								icon={<AttachMoneyIcon />}
								label={appointment?.totalCost}
								variant="outlined"
							/>
						</div>
						<AppointmentAdd />
					</Toolbar>
				</AppBar>
				<AppointmentMenu />
				<Box flex="display" justifyContent="center" alignContent="center">
					<AppointmentTable />
				</Box>
			</Box>
		</Container>
	)
}
