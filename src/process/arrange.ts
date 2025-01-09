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

function arrange_subjects(data: SisData): SubjectData[] {
    return []
}

function arrange_schedule(data: SisData): ScheduleTable {
    const table: ScheduleRow[] = []
    
    // get all the unique timestamps in the data and sort them
    const minutes = get_times(data)

    // no timestamps means no data
    if (minutes.length === 0) {
        return { table }
    }

    // fill the table with empty cells
    // compute the size of each row by the number of minutes between each timestamp
    minutes.push(minutes[minutes.length - 1] + 30)
    let prev_minutes = minutes[0]
    for (const time of minutes.slice(1)) {
        table.push({
            time: minutes_time(prev_minutes),
            size: time - prev_minutes,
            columns: new Array(7).fill(EMPTY_SLOT)
        })
        prev_minutes = time
    }

    // fill in the table data
    for (const subject of data.subjects) {
        for (const subj_slot of subject.subj_sched) {
            const start_row = minutes.indexOf(time_minutes(subj_slot.start))
            const end_row = minutes.indexOf(time_minutes(subj_slot.end))
            const rowspan = end_row - start_row

            for (const weekday of subj_slot.weekdays) {
                const col = weekday_index(weekday)
                // add the main subject tile
                table[start_row].columns[col] = {
                    data: {
                        type: 'subject',
                        subject,
                    },
                    colspan: 1,
                    rowspan,
                }
                // delete the tiles that the subject overlaps
                for (let row = start_row + 1; row < end_row; row++) {
                    table[row].columns[col] = null
                }
            }
        }
    }
    // TODO: post-process the table to detect lunch break
    // what do you mean saturday's lunch break is different from the weekdays'
    return { table }
}

/**
 * Arranges SIS data into a table close to how HTML would format it.
 * @param data the SIS data to arrange
 * @returns the subjects and the schedule
 */
export function arrange(data: SisData): { subjects: SubjectData[], schedule: ScheduleTable } {
    return {
        subjects: arrange_subjects(data),
        schedule: arrange_schedule(data), }
}