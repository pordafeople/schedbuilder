import { ClassCode, Weekday } from '../process/parse'
import { ClassList, SisTableData, WeekdayConfig } from '../process/arrange'

export type Color = string
export type ColorSet = {
    light: Color
    normal: Color
    // dark: Color
}

export type WeekdayColors = Record<Weekday, ColorSet>
export const WEEKDAY_COLORS_DEFAULT: WeekdayColors = {
    S: { light: '#ecc', normal: '#dbb' },
    M: { light: '#eee', normal: '#ddd' },
    T: { light: '#ddd', normal: '#ccc' },
    W: { light: '#eee', normal: '#ddd' },
    Th: { light: '#ddd', normal: '#ccc' },
    F: { light: '#eee', normal: '#ddd' },
    Sa: { light: '#ccc', normal: '#bbb' },
}
export function get_weekday_colors(_config: WeekdayConfig): WeekdayColors {
    // no logic here
    return WEEKDAY_COLORS_DEFAULT
}

export type ClassColors = Record<ClassCode, ColorSet>
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

export type DisplayData = {
    // resolution: [number, number] // TODO
    weekdays: WeekdayColors
    classes: ClassColors
}

export function get_display_data(data: SisTableData): DisplayData {
    return {
        weekdays: get_weekday_colors(data.schedule.weekday_config),
        classes: get_class_colors(data.classes),
    }
}
