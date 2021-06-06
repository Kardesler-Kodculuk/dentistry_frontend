import React from "react"
import { AppointmentProvider, QueryProvider, BackdropProvider } from "@dentistry/services"
import { Appointments } from "@dentistry/pages"
function App() {
	return (
		<div className="App">
			<BackdropProvider>
				<QueryProvider>
					<AppointmentProvider>
						<Appointments />
					</AppointmentProvider>
				</QueryProvider>
			</BackdropProvider>
		</div>
	)
}

export default App
