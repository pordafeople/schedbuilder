import { ScheduleTable, WEEKDAY_CONFIG_DEFAULT } from '../process/arrange'
import { ClassData } from '../process/parse'

const philo: ClassData = {
    code: '16-999A',
    subject: 'Philo 1000',
    title: 'PHILOSOPHY',
    schedule: [], // ignore this when displaying, it's only necessary for computing
    teacher: {
        family_name: 'FAMILYNAME',
        given_name: 'GIVEN NAME',
        emails: ['sampleemail@addu.edu.ph'],
    },
}

const itc: ClassData = {
    code: '4-111',
    subject: 'CS 1111',
    title: 'INTRODUCTION TO COMPUTING',
    schedule: [], // ignore this when displaying, it's only necessary for computing
    teacher: {
        family_name: 'GAMING',
        given_name: 'CHRIS ALVIORITHM',
        emails: ['cagaming@addu.edu.ph'],
    },
}

export const sample_subjects: ClassData[] = [philo, itc]

export const sample_table: ScheduleTable = {
    weekday_config: WEEKDAY_CONFIG_DEFAULT,
    table: [
        {
            time: { hour: 7, minute: 40 },
            size: 60,
            columns: [
                {
                    data: { type: 'class', class_code: philo.code },
                    rowspan: 1,
                    colspan: 1,
                },
                {
                    data: { type: 'class', class_code: itc.code },
                    rowspan: 2,
                    colspan: 1,
                },
                {
                    data: { type: 'class', class_code: philo.code },
                    rowspan: 1,
                    colspan: 1,
                },
                {
                    data: { type: 'class', class_code: itc.code },
                    rowspan: 2,
                    colspan: 1,
                },
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
            ],
        },
        {
            time: { hour: 9, minute: 10 },
            size: 60,
            columns: [
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
                null,
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
                null,
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
                { data: { type: 'empty' }, rowspan: 1, colspan: 1 },
            ],
        },
    ],
}
