// i could've structured it like an actual parser to avoid all the nested regex stuff
// but we're here and it kinda works so

export type Time = {
    hour: number,
    minute: number,
}

function parse_time(text: string): Time {
    const re = /(\d+):(\d+)([AP])/
    const match = text.match(re)!
    const am_pm_offset = match[3] === 'A' ? 0 : 12
    return {
        hour: parseInt(match[1]) % 12 + am_pm_offset,
        minute: parseInt(match[2]),
    }
}

export function time_str(time: Time): string {
    const am_pm = time.hour < 12 ? 'A' : 'P'
    const hour = ((time.hour + 11) % 12 + 1).toString()
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
const WEEKDAYS = ['S', 'M', 'T', 'W', 'Th', 'F', 'Sa']

function parse_weekdays(text: string): Weekday[] {
    const re = /Th|Sa|[SMTWF]/g;
    return [...text.matchAll(re)].map(match => match[0]);
}

export type WeekdayIndex = number

export function weekday_index(weekday: Weekday): WeekdayIndex {
    return WEEKDAYS.indexOf(weekday)
}

export function index_weekday(index: WeekdayIndex): Weekday {
    return WEEKDAYS[index]
}


export type ClassPeriod = {
    start: Time,
    end: Time,
    room: string,
    weekdays: Weekday[],
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


export type SubjectSchedule = ClassPeriod[]

function parse_schedule(text: string): SubjectSchedule {
    return [...text.matchAll(period_regex)].map(parse_period)

}


export type Emails = string[]

function parse_emails(emails: string): Emails {
    const re = /[\w]+@[\w.]+/g
    return [...emails.matchAll(re)].map(match => match[0])
}


export type Teacher = {
    family_name: string,
    given_name: string,
    emails: Emails,
}

function parse_teacher(name: string, emails: string): Teacher {
    const re = /([\w]+), ([\w ]+)(?:\n([\w@ .]+))?/
    const match = name.match(re) || null
    return {
        family_name: match?.[1] || '<???>',
        given_name: match?.[2] || '<???>',
        emails: parse_emails(emails || ''),
    }
}


// CODE	SUBJ. NO	DESCRIPTIVE TITLE	SCHEDULE	TEACHER	UNIT	Required
/** Data for a single class of a course. */
export type SubjectData = {
    /** The class code. Usable as a primary key. */
    code: string
    subj_no: string
    title: string
    subj_sched: SubjectSchedule
    teacher: Teacher
}

const subject_regex = /^(\d+-\d+)\s?(\w+ \d+)\s?([\w, \-\d]+)\s?\* ((?:.+? \*)+)\s?([\w, ]+)?\s?([a-z@\.;]+)?\s?(\d)\/(\d)\s?$/gm
function parse_subject(match: RegExpExecArray): SubjectData {
    return {
        code: match[1],
        subj_no: match[2],
        title: match[3],
        subj_sched: parse_schedule(match[4]),
        teacher: parse_teacher(match[5] || '', match[6]),
    }
}


export type SisData = {
    subjects: SubjectData[]
}

export function parse_sis(text: string): SisData {
    return { subjects: [...text.replace(/\r/g, '').matchAll(subject_regex)].map(parse_subject) }
}
