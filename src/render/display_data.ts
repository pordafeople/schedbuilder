import { ClassCode, Weekday } from '../process/parse'
import { ClassList, SisTableData, WeekdayConfig } from '../process/arrange'

export type Color = string
export type ColorSet = {
    light: Color
    normal: Color
    // dark: Color
}

export type WeekdayColors = Record<Weekday, ColorSet>
export function weekday_colors_default(): WeekdayColors {
    return {
        S: { light: '#fee', normal: '#f99' },
        M: { light: '#fff', normal: '#ccc' },
        T: { light: '#eee', normal: '#aaa' },
        W: { light: '#fff', normal: '#ccc' },
        Th: { light: '#eee', normal: '#aaa' },
        F: { light: '#fff', normal: '#ccc' },
        Sa: { light: '#eef', normal: '#99f' },
    }
}
export function get_weekday_colors(_config: WeekdayConfig): WeekdayColors {
    // is_pe_day(weekday) ? display_data.pe_color
    return weekday_colors_default()
}

export type ClassColors = Record<ClassCode, ColorSet>

// FOOTGUN: constants are not actually constant. they can be modified.
// i should read more about typescript.
const PALETTE_DEFAULT = [
    { light: '#faa', normal: '#f88' },
    { light: '#fca', normal: '#ea8' },
    { light: '#dda', normal: '#dd8' },
    { light: '#aea', normal: '#8e8' }, // one green instead of  '#ae8', '#8f8', '#8ea'
    { light: '#add', normal: '#8dd' },
    { light: '#acf', normal: '#8ae' },
    { light: '#aaf', normal: '#88f' },
    { light: '#caf', normal: '#a8e' },
    { light: '#dad', normal: '#d8d' },
    { light: '#fac', normal: '#e8a' },
]
export function get_class_colors(classes: ClassList): ClassColors {
    return classes.reduce((acc, class_data, index) => {
        acc[class_data.code] = PALETTE_DEFAULT[index % PALETTE_DEFAULT.length]
        return acc
    }, {} as ClassColors)
}

export type TimeColors = {
    am: Color
    pm: Color
}

export type DisplayData = {
    // resolution: [number, number] // TODO
    bg_color: Color
    time_colors: TimeColors
    bar_color: Color
    pe_color: Color | null
    weekdays: WeekdayColors
    classes: ClassColors
}

export function display_data_default(): DisplayData {
    return {
        bg_color: '#a8d',
        time_colors: { am: '#feb0', pm: '#edf0' }, // both of these are transparent now
        bar_color: '#99f',
        pe_color: null,
        weekdays: {},
        classes: {},
    }
}

export function get_display_data(data: SisTableData): DisplayData {
    return {
        ...display_data_default(),
        weekdays: get_weekday_colors(data.schedule.weekday_config),
        classes: get_class_colors(data.classes),
    }
}
