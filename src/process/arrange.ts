import {
    minutes_time,
    SisData,
    ClassData,
    Time,
    time_minutes,
    TimeMinutes,
    weekday_index,
    WeekdayIndex,
    Weekday,
    WEEKDAYS,
    ClassPeriod,
} from './parse'

export type TimeSlot = {
    weekday: Weekday
    rowspan: number
    colspan: number
    duration: TimeMinutes
    data:
        | { type: 'class'; class_data: ClassData; class_period: ClassPeriod }
        | { type: 'bar'; text: string }
        | { type: 'empty' }
}

function empty_slot(weekday: Weekday, duration: TimeMinutes): TimeSlot {
    return {
        weekday,
        rowspan: 1,
        colspan: 1,
        duration,
        data: { type: 'empty' },
    }
}

const DEFAULT_SLOT_DURATION: TimeMinutes = 60

export type ScheduleRow = {
    time: Time
    duration: TimeMinutes
    columns: (TimeSlot | null)[]
}

export type WeekdayConfig = {
    start: WeekdayIndex
    end: WeekdayIndex
}
export const WEEKDAY_CONFIG_DEFAULT: WeekdayConfig = {
    start: 1,
    end: 7,
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

export type ClassList = ClassData[]

// TODO: remove unnecessary weekdays

function arrange_schedule(data: SisData): ScheduleTable {
    const table: ScheduleRow[] = []

    // get all the unique timestamps in the data and sort them
    const times = get_times(data)

    // no timestamps means no data
    if (times.length === 0) {
        return {
            weekday_config: WEEKDAY_CONFIG_DEFAULT,
            table,
        }
    }

    // fill the table with empty cells
    // compute the size of each row by the number of minutes between each timestamp
    times.push(times[times.length - 1] + DEFAULT_SLOT_DURATION)
    let prev_minutes = times[0]
    for (const time of times.slice(1)) {
        const duration = time - prev_minutes
        table.push({
            time: minutes_time(prev_minutes),
            duration: duration,
            columns: WEEKDAYS.map((weekday) => empty_slot(weekday, duration)),
        })
        prev_minutes = time
    }

    // fill in the table data
    for (const class_data of data.classes) {
        for (const class_period of class_data.schedule) {
            const { start, end, weekdays } = class_period
            const start_row = times.indexOf(time_minutes(start))
            const end_row = times.indexOf(time_minutes(end))
            const rowspan = end_row - start_row

            for (const weekday of weekdays) {
                const col = weekday_index(weekday)
                // add the main subject tile
                table[start_row].columns[col] = {
                    weekday,
                    colspan: 1,
                    rowspan,
                    duration: times[end_row] - times[start_row],
                    data: {
                        type: 'class',
                        class_data,
                        class_period,
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

export type SisTableData = {
    classes: ClassList
    schedule: ScheduleTable
}

/**
 * Arranges SIS data into a table close to how HTML would format it.
 * @param data the SIS data to arrange
 * @returns the subjects and the schedule
 */
export function arrange(data: SisData): SisTableData {
    return {
        classes: data.classes,
        schedule: arrange_schedule(data),
    }
}
