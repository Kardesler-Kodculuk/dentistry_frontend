import React from "react"
import { AppointmentProvider, QueryProvider } from "@dentistry/services"
import { Appointments } from "@dentistry/pages"
function App() {
	return (
		<div className="App">
			<QueryProvider>
				<AppointmentProvider>
					<Appointments />
				</AppointmentProvider>
			</QueryProvider>
		</div>
	)
}

export default App
