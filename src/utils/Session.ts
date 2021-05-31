import { AppointmentInfo, Time } from "@dentistry/interfaces"
import { useAppointment } from "@dentistry/services"

function calculateInterval(value: AppointmentInfo, intervals: Time[]) {
    let start: Time | undefined = intervals.find((e) => e.timeValues[0] === value.date_.getHours() && e.timeValues[1] === value.date_.getMinutes())
    if (start && start?.time_id !== undefined) {
        let time = start?.time_id
        let a = intervals.filter(e => e.time_id < time)
        let b = intervals.filter(e => e.time_id >= time + value.duration)
        return [...a, ...b]
    }
    return [...intervals]
}

export function CalculateDuration(value: AppointmentInfo, intervals: Time[]) {
    let start = intervals.find((e) => e.timeValues[0] === value.date_.getHours() && e.timeValues[1] === value.date_.getMinutes())
    if (!start) {
        return null
    }
    let end = intervals[start?.time_id + value.duration]
    return start?.name + " - " + end?.name
}


export function CalculateOpenSessions(values: AppointmentInfo[], intervals: Time[], self?: AppointmentInfo) {
    let empty: Time[] = [...intervals]
    let fill: Time[] = [...intervals]
    if (self) {
        values.map((e) => { if (e.appointment_id !== self.appointment_id) { empty = [...calculateInterval(e, empty)] }; return 1 })
    } else {
        values.map((e) => { empty = [...calculateInterval(e, empty)]; return 1 })
    }
    let slots: { time: Time, ends: Time[] }[] = []
    let slot = empty.shift()
    let i = 0
    while (slot) {
        slots.push({ time: slot, ends: [] })
        let copy = [...empty]
        let next = copy.shift()
        while (next) {
            if (next?.time_id === slot.time_id + 1) {
                slots[i].ends.push(next)
            }
            else {
                break
            }
            slot = next
            next = copy.shift()
        }
        slot = empty.shift()
        i++
    }
    slots = slots.filter(e => e.time.time_id !== fill[fill.length - 1].time_id)
    slots.forEach(e => {
        if (e.ends.length === 0) {
            let value = fill.find(i => e.time.time_id + 1 === i.time_id)
            if (value) {
                e.ends.push(value)
            }
        } else {
            let value = fill.find(i => e.ends[e.ends.length - 1].time_id + 1 === i.time_id)
            if (value) {
                e.ends.push(value)
            }
        }
    })

    return slots
}