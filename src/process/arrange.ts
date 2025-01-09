// apologies in advance for my C style

import { SisData, SubjectData, Time, time_minutes, time_str, Weekday, weekday_value } from './parse'

export type SubjectSlot = {
    subject: SubjectData,
    rowspan: number,
}

export type TimeSlot = SubjectSlot | null

export type Bar = {
    text: string,
}

export type ScheduleRow = {
    time: Time,
    size: number,
    columns: TimeSlot[] | Bar,
}

export type ScheduleTable = {
    // weekdays: Weekday[]
    table: ScheduleRow[]
}

// function sort_by_key<T>(array: T[], key: (item: T) => number): T[] {
//     return array.sort((a, b) => key(a) - key(b))
// }
// const dedup_filter = (item: any, pos: number, arr: any[]) => {
//     return pos == 0 || item != arr[pos - 1]
// }

// function get_weekdays(data: SisData): Weekday[] {
//     const out: Weekday[] = []
//     for (const subj of data.subjects) {
//         for (const slot of subj.subj_sched) {
//             for (const weekday of slot.weekdays) {
//                 out.push(weekday)
//             }
//         }
//     }
//     return sort_by_key(out, weekday_value).filter(dedup_filter)
// }

// function get_times(data: SisData): Time[] {
//     const times: Time[] = []
//     for (const subj of data.subjects) {
//         for (const slot of subj.subj_sched) {
//             times.push(slot.start)
//             times.push(slot.end)
//         }
//     }
//     return sort_by_key(times, time_minutes).filter(dedup_filter)
// }

// export function arrange(data: SisData): ScheduleTable {
//     const table: ScheduleRow[] = []
//     const times = get_times(data)
//     let prev_time = times[0]
//     for (const time of times.slice(1)) {
//         table.push({
//             time: prev_time,
//             size: time_minutes(time) - time_minutes(prev_time),
//             columns: new Array(6).fill(null)
//         })
//     }
    
//     for (const subj of data.subjects) {
//         for (const subj_slot of subj.subj_sched) {
//             const start_row = times.indexOf(subj_slot.start)
//             const end_row = times.indexOf(subj_slot.end)
//             const rowspan = end_row - start_row
//             for (const weekday of subj_slot.weekdays) {
//                 const target_slot = table[start_row].
//             }
//         }
//     }
//     return { table }
// }