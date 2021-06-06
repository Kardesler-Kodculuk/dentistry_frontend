import React from "react"
import { AppointmentProvider, QueryProvider, BackdropProvider } from "@dentistry/services"
import { Appointments } from "@dentistry/pages"
import { SnackbarProvider } from "notistack"
function App() {
	return (
		<div className="App">
			<BackdropProvider>
				<SnackbarProvider
					maxSnack={3}
					anchorOrigin={{
						vertical: "bottom",
						horizontal: "right",
					}}>
					<QueryProvider>
						<AppointmentProvider>
							<Appointments />
						</AppointmentProvider>
					</QueryProvider>
				</SnackbarProvider>
			</BackdropProvider>
		</div>
	)
}

export default App
