import { Array, Form } from "@dentistry/interfaces"

export interface Appointment {
    appointments: Array<AppointmentInfo>
    intervals: Array<Time>
    doctors: Array<Doctor>
    selectedDoctors: Array<Doctor>
    operations: Array<Operation>
    selectedOperations: Array<Operation>
    information: Form<string>
    date: Form<Date>
    time: Form<[number, number]>
}

export interface Time { time_id: number, name: string; timeValues: [number, number] }
export interface Doctor { doctor_id: number; doctor_name: string, checked: boolean }
export interface Operation { diagnosis_id: number; diagnosis_name: string, diagnosis_price: number }
export interface Patient { patient_id: number; patient_name: string, phone_number: string }

export interface AppointmentQuery {
    appointment_id: number;
    doctor_id: number;
    diagnosis_ids: number[];
    patient_id: number;
    duration: number;
    date_: number;
    notes: string;
}

export interface AppointmentInfo {
    appointment_id: number;
    doctor: Doctor | undefined;
    operations: Operation[] | undefined;
    patient: Patient | undefined;
    duration: number;
    date_: Date;
    notes: string;
}

export function timeCmp(value: Time, e: Time): boolean {
    return value.name === e.name
}

export function doctorCmp(value: Doctor, e: Doctor): boolean {
    return value.doctor_id === e.doctor_id
}

export function operationCmp(value: Operation, e: Operation): boolean {
    return value.diagnosis_id === e.diagnosis_id
}

export function appointmentCmp(value: AppointmentInfo, e: AppointmentInfo): boolean {
    return value.appointment_id === e.appointment_id
}