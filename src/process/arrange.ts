import {
    minutes_time,
    SisData,
    ClassData,
    Time,
    time_minutes,
    TimeMinutes,
    weekday_index,
    WeekdayIndex,
    ClassCode,
    Weekday,
    WEEKDAYS,
} from './parse'

export type Color = string

export type TimeSlot = null | {
    weekday: Weekday
    rowspan: number
    colspan: number
    data:
        | { type: 'class'; class_code: ClassCode }
        | { type: 'bar'; text: string }
        | { type: 'empty' }
}

function empty_slot(weekday: Weekday): TimeSlot {
    return {
        weekday,
        rowspan: 1,
        colspan: 1,
        data: { type: 'empty' },
    }
}

export type ScheduleRow = {
    time: Time
    size: number
    columns: TimeSlot[]
}

export type WeekdayConfig = {
    start: WeekdayIndex
    end: WeekdayIndex
    colors: Color[]
}
export const WEEKDAY_CONFIG_DEFAULT = {
    start: 1,
    end: 7,
    colors: [/*'#ccc',*/ '#eee', '#ddd', '#eee', '#ddd', '#eee', '#ccc'],
}

export type ScheduleTable = {
    weekday_config: WeekdayConfig
    table: ScheduleRow[]
}

function key_sort_dedup<T>(array: T[], key: (item: T) => number): number[] {
    const dedup_filter = (item: any, pos: number, arr: any[]) => {
        return pos === 0 || item !== arr[pos - 1]
    }
    return array
        .map(key)
        .sort((a, b) => a - b)
        .filter(dedup_filter)
}

function get_times(data: SisData): TimeMinutes[] {
    const times: Time[] = []
    for (const class_data of data.classes) {
        for (const slot of class_data.schedule) {
            times.push(slot.start)
            times.push(slot.end)
        }
    }
    return key_sort_dedup(times, time_minutes)
}

export type ClassDisplayData = {
    class_data: ClassData
    color: Color
}

export type ClassList = ClassDisplayData[]

function get_classes(data: SisData): ClassList {
    const PALETTE_DEFAULT = [
        '#f88',
        '#ea8',
        '#dd8',
        '#8e8', // one green instead of  '#ae8', '#8f8', '#8ea',
        '#8dd',
        '#8ae',
        '#88f',
        '#a8e',
        '#d8d',
        '#e8a',
    ]
    // TODO: auto-gen palette
    return data.classes.map((class_data, index) => ({
        class_data,
        color: PALETTE_DEFAULT[index % PALETTE_DEFAULT.length],
    }))
}

// TODO: remove unnecessary weekdays

function arrange_schedule(data: SisData): ScheduleTable {
    const table: ScheduleRow[] = []

    // get all the unique timestamps in the data and sort them
    const minutes = get_times(data)

    // no timestamps means no data
    if (minutes.length === 0) {
        return {
            weekday_config: WEEKDAY_CONFIG_DEFAULT,
            table,
        }
    }

    // fill the table with empty cells
    // compute the size of each row by the number of minutes between each timestamp
    minutes.push(minutes[minutes.length - 1] + 30)
    let prev_minutes = minutes[0]
    for (const time of minutes.slice(1)) {
        table.push({
            time: minutes_time(prev_minutes),
            size: time - prev_minutes,
            columns: WEEKDAYS.map(empty_slot),
        })
        prev_minutes = time
    }

    // fill in the table data
    for (const class_data of data.classes) {
        for (const class_period of class_data.schedule) {
            const start_row = minutes.indexOf(time_minutes(class_period.start))
            const end_row = minutes.indexOf(time_minutes(class_period.end))
            const rowspan = end_row - start_row

            for (const weekday of class_period.weekdays) {
                const col = weekday_index(weekday)
                // add the main subject tile
                table[start_row].columns[col] = {
                    weekday,
                    colspan: 1,
                    rowspan,
                    data: {
                        type: 'class',
                        class_code: class_data.code,
                    },
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
    return {
        weekday_config: WEEKDAY_CONFIG_DEFAULT,
        table,
    }
}

export type SisDisplayData = {
    classes: ClassList
    schedule: ScheduleTable
}

/**
 * Arranges SIS data into a table close to how HTML would format it.
 * @param data the SIS data to arrange
 * @returns the subjects and the schedule
 */
export function arrange(data: SisData): SisDisplayData {
    return {
        classes: get_classes(data),
        schedule: arrange_schedule(data),
    }
}
