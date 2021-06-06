import {
	CardContent,
	makeStyles,
	Container,
	Grid,
	TableContainer,
	Table,
	Button,
	Box,
	Paper,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
	root: {
		marginTop: 45,
	},
	container: {
		width: "100%",
	},
	table: {
		maxHeight: 700,
		overflow: "auto",
	},

	buttons: {
		marginLeft: theme.spacing(0.5),
	},
	box: {
		display: "flex",
	},
	body: {
		fontSize: 14,
	},
}))

type props = {
	children: any
	title?: string
	buttons?: { value: string; handler: Function }[]
	smaller?: true
}

export function CustomTable(props: props) {
	const classes = useStyles()
	return (
		<div>
			<Box className={classes.box} left="80%">
				{props.buttons?.map((button, i) => (
					<Button variant="contained" color="primary" key={"user_table_buttons_" + i}>
						{button.value}
					</Button>
				))}
			</Box>
			<CardContent>
				<Container>
					<Grid
						container
						direction="column"
						justify="center"
						alignItems="center"
						style={{ minHeight: "1vh", minWidth: "35vh" }}>
						<Paper className={classes.container}>
							<TableContainer className={classes.table}>
								<TableContainer>
									<Table>{props.children}</Table>
								</TableContainer>
							</TableContainer>
						</Paper>
					</Grid>
				</Container>
			</CardContent>
		</div>
	)
}
