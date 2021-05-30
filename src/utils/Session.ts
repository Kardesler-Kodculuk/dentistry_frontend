import { AppointmentInfo, Time } from "@dentistry/interfaces"
import { useAppointment } from "@dentistry/services"
export function CalculateDuration(value: AppointmentInfo, intervals: Time[]) {
    let start = intervals.find((e) => e.timeValues[0] === value.date_.getHours() && e.timeValues[1] === value.date_.getMinutes())
    if (!start) {
        return null
    }
    let end = intervals[start?.time_id + value.duration]
    return start?.name + " - " + end?.name
}