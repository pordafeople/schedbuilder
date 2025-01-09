// apologies in advance for my C style

import { minutes_time, SisData, SubjectData, Time, time_minutes, time_str, TimeMinutes, Weekday, weekday_index } from './parse'

const EMPTY_SLOT: TimeSlot = {
    data: { type: 'empty' },
    rowspan: 1,
    colspan: 1,
}
export type TimeSlot = null | {
    data:
        | { type: 'subject', subject: SubjectData }
        | { type: 'bar', text: string }
        | { type: 'empty' }
    rowspan: number
    colspan: number
}

export type ScheduleRow = {
    time: Time
    size: number
    columns: TimeSlot[]
}

export type ScheduleTable = {
    // weekdays: Weekday[]
    table: ScheduleRow[]
}

function key_sort_dedup<T>(array: T[], key: (item: T) => number): number[] {
    const dedup_filter = (item: any, pos: number, arr: any[]) => {
        return pos === 0 || item !== arr[pos - 1]
    }
    return array.map(key).sort((a, b) => a - b).filter(dedup_filter)
}

function get_times(data: SisData): TimeMinutes[] {
    const times: Time[] = []
    for (const subj of data.subjects) {
        for (const slot of subj.subj_sched) {
            times.push(slot.start)
            times.push(slot.end)
        }
    }
    return key_sort_dedup(times, time_minutes)
}

// TODO: remove unnecessary weekdays
// TODO: delete table tiles that will be overwritten by rowspan and colspan

export function arrange(data: SisData): { subjects: SubjectData[], schedule: ScheduleTable } {
    const subjects: SubjectData[] = []
    const table: ScheduleRow[] = []
    const minutes = get_times(data)
    if (minutes.length === 0) {
        return { subjects, schedule: { table } }
    }
    console.log(minutes)
    let prev_minutes = minutes[0]
    minutes.push(minutes[minutes.length - 1] + 30)
    for (const time of minutes.slice(1)) {
        table.push({
            time: minutes_time(prev_minutes),
            size: time - prev_minutes,
            columns: new Array(7).fill(EMPTY_SLOT)
        })
        prev_minutes = time
    }
    // console.log(table)
    
    for (const subject of data.subjects) {
        for (const subj_slot of subject.subj_sched) {
            const start_row = minutes.indexOf(time_minutes(subj_slot.start))
            const end_row = minutes.indexOf(time_minutes(subj_slot.end))
            const rowspan = end_row - start_row
            console.log(subj_slot.start, start_row, subj_slot.end, end_row)
            for (const weekday of subj_slot.weekdays) {
                const col = weekday_index(weekday)
                table[start_row].columns[col] = {
                    data: {
                        type: 'subject',
                        subject,
                    },
                    colspan: 1,
                    rowspan,
                }
                for (let row = start_row + 1; row < end_row; row++) {
                    table[row].columns[col] = null
                }
            }
        }
    }
    return { subjects, schedule: { table } }
}