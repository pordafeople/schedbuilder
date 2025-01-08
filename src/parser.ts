type Time = {
    hour: number,
    minute: number,
}

function parse_time(text: string): Time {
    const re = /(\d+):(\d+)([AP])/
    const match = text.match(re)!
    const am_pm_offset = match[3] == 'A' ? 0 : 12
    return {
        hour: parseInt(match[1]) + am_pm_offset,
        minute: parseInt(match[2]),
    }
}

type Weekday = string

function parse_weekdays(text: string): Weekday[] {
    // can this array creation be skipped?
    const weekdays = []
    for (const match of text.matchAll(/[MTWFS]|Th/)) {
        weekdays.push(match[0])
    }
    return weekdays
}

type ClassPeriod = {
    start: Time,
    end: Time,
    room: string,
    weekdays: Weekday[],
}

const period_regex = /(\d+:\d+[AP])-(\d+:\d+[AP]) ([\w]+) (\w+)/
function parse_period(match: RegExpExecArray): ClassPeriod {
    return {
        start: parse_time(match[1]),
        end: parse_time(match[2]),
        room: match[3],
        weekdays: parse_weekdays(match[4]),
    }
}

type SubjectSchedule = ClassPeriod[]

function parse_schedule(text: string): SubjectSchedule {
    const periods = []
    for (const match of text.matchAll(period_regex)) {
        periods.push(parse_period(match))
    }
    return periods

}

type Teacher = {
    family_name: string,
    given_name: string,
    emails: string[],
}

type Emails = string[]

function parse_emails(emails: string): Emails {
    const re = /[\w]+@[\w.]+/
    const out = []
    for (const match of emails.matchAll(re)) {
        out.push(match[0])
    }
    return out
}

function parse_teacher(name: string, emails: string): Teacher {
    const re = /([\w]+), ([\w ]+)(?:\n([\w@ .]+))?/
    const match = name.match(re)!
    return {
        family_name: match[1],
        given_name: match[2],
        emails: parse_emails(emails),
    }
}

// CODE	SUBJ. NO	DESCRIPTIVE TITLE	SCHEDULE	TEACHER	UNIT	Required
type SubjectData = {
    /**
     * Usable as a primary key.
     */
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
        teacher: parse_teacher(match[5], match[6]),
    }
}

type SisData = {
    subjects: SubjectData[]
}

function parse_sis(text: string): SisData {
    const subjects = []
    for (const match of text.matchAll(subject_regex)) {
        subjects.push(parse_subject(match))
    }
    return { subjects }
}