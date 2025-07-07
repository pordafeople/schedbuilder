// i could've structured it like an actual parser to avoid all the nested regex stuff
// but we're here and it kinda works so

export type Time = {
    hour: number
    minute: number
}

export const TIME_NOON = { hour: 12, minute: 0 }

export function time_eq(a: Time, b: Time): boolean {
    return a.hour === b.hour && a.minute === b.minute
}

export function time_is_noon(time: Time): boolean {
    return time_eq(time, TIME_NOON)
}

function parse_time(text: string): Time {
    const re = /(\d+):(\d+)([AP])/
    const match = text.match(re)!
    const am_pm_offset = match[3] === 'A' ? 0 : 12
    return {
        hour: (parseInt(match[1]) % 12) + am_pm_offset,
        minute: parseInt(match[2]),
    }
}

export function time_str(time: Time): string {
    const am_pm = time.hour < 12 ? 'A' : 'P'
    const hour = (((time.hour + 11) % 12) + 1).toString()
    const minute = time.minute.toString().padStart(2, '0')
    return `${hour}:${minute}${am_pm}`
}

export type TimeMinutes = number

export function time_minutes(time: Time): TimeMinutes {
    return time.hour * 60 + time.minute
}

export function minutes_time(minutes: TimeMinutes): Time {
    return {
        hour: Math.floor(minutes / 60),
        minute: minutes % 60,
    }
}

export type Weekday = string
export const WEEKDAYS = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa']

function parse_weekdays(text: string): Weekday[] {
    const re = /Th|Sa|[SMTWF]/g
    return [...text.matchAll(re)].map((match) => match[0])
}

export type WeekdayIndex = number

export function weekday_index(weekday: Weekday): WeekdayIndex {
    return WEEKDAYS.indexOf(weekday)
}

export function index_weekday(index: WeekdayIndex): Weekday {
    return WEEKDAYS[index]
}

export type ClassPeriod = {
    start: Time
    end: Time
    room: string
    weekdays: Weekday[]
}

const period_regex = /(\d+:\d+[AP])-(\d+:\d+[AP]) ([A-Z](?:[a-z]+ )?\w+) (\w+)/g
function parse_period(match: RegExpExecArray): ClassPeriod {
    return {
        start: parse_time(match[1]),
        end: parse_time(match[2]),
        room: match[3],
        weekdays: parse_weekdays(match[4]),
    }
}

export type ClassSchedule = ClassPeriod[]

function parse_schedule(text: string): ClassSchedule {
    return [...text.matchAll(period_regex)].map(parse_period)
}

export type Emails = string[]

function parse_emails(emails: string): Emails {
    return emails.split(';')
}

export type Teacher = {
    family_name: string
    given_name: string
    emails: Emails
}

function parse_teacher(name: string, emails: string): Teacher {
    const re = /([^,]+), (.+)/
    const match = name.match(re)
    return {
        family_name: match?.[1] ?? '<???>',
        given_name: match?.[2] ?? '<???>',
        emails: parse_emails(emails ?? '<no email given>'),
    }
}

export type ClassCode = string
export type Subject = string

// CODE	SUBJ. NO	DESCRIPTIVE TITLE	SCHEDULE	TEACHER	UNIT	Required
export type ClassData = {
    /** The class code. Usable as a primary key. */
    code: ClassCode
    subject: Subject
    title: string
    schedule: ClassSchedule
    teacher: Teacher
}

// don't ask. read.
const class_regex =
    /(\d+-\d+)\s*((?:\w+ )+\d+)\s*([^*]+)\s*\* ((?:.+? \*)+)\s*([^\n]+)?\s*([^ \n]+)?\s*(\d+)\/(\d+)\s*/g
function parse_class(match: RegExpExecArray): ClassData {
    return {
        code: match[1],
        subject: match[2],
        title: match[3],
        schedule: parse_schedule(match[4]),
        teacher: parse_teacher(match[5] ?? '', match[6]),
    }
}

export function class_is_pe(class_data: ClassData): boolean {
    return class_data.subject.startsWith('PE')
}

export type SisData = {
    classes: ClassData[]
}

export function parse_sis(text: string): { sis_data: SisData; err?: string } {
    text = '\n' + text.replace(/[\r\t]/g, '') + '\n'
    // subjects begin with whitespace and a number, followed by any characters (except @ or newline, which appears for emails on separate lines)
    const pasted_subjects = [...text.matchAll(/^\s*\d+[^@\n]+$/gm)]
    const classes = [...text.matchAll(class_regex)].map(parse_class)
    let err = undefined
    if (pasted_subjects.length !== classes.length) {
        err =
            `There are missing subjects/classes in the output, or the input detection is faulty.\n` +
            `\n` +
            `- Detected classes in input: ${pasted_subjects.length} (double check)\n` +
            `- Fully identified classes: ${classes.length}\n` +
            `\n` +
            `The number of input subjects was determined by finding numbers at the start of each line.` +
            `\n` +
            `Please report this and include the text you pasted.`
    }
    return { sis_data: { classes }, err }
}
