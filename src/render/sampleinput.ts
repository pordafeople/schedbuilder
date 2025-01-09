import { ScheduleTable } from "../process/arrange"
import { SubjectData } from "../process/parse"

const philo: SubjectData = {
    code: '16-999A',
    subj_no: 'Philo 1000',
    title: 'PHILOSOPHY',
    subj_sched: [], // ignore this when displaying, it's only necessary for computing
    teacher: {
        family_name: 'FAMILYNAME',
        given_name: 'GIVEN NAME',
        emails: ['sampleemail@addu.edu.ph'],
    },
}

const itc: SubjectData = {
    code: '4-111',
    subj_no: 'CS 1111',
    title: 'INTRODUCTION TO COMPUTING',
    subj_sched: [], // ignore this when displaying, it's only necessary for computing
    teacher: {
        family_name: 'GAMING',
        given_name: 'CHRIS ALVIORITHM',
        emails: ['cagaming@addu.edu.ph'],
    },
}

export const sample_subjects: SubjectData[] = [
    philo,
    itc,
]

export const sample_table: ScheduleTable = {
    table: [
        {
            time: { hour: 7, minute: 40 },
            size: 60,
            columns: [
                { subject: philo, rowspan: 1 },
                { subject: itc, rowspan: 2 },
                { subject: philo, rowspan: 1 },
                { subject: itc, rowspan: 2 },
                null,
                null,
            ]
        },
        {
            time: { hour: 9, minute: 10 },
            size: 60,
            columns: [
                null,
                null,
                null,
                null,
                null,
                null,
            ]
        },
    ],
}