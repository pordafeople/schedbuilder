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

export const sample_text: string = `
17-000ASF 1101ARRUPE SOCIAL FORMATION 1* 1:30P-4:30P F111 Sa *ASFLAST, ASFFIRST ASFSECOND
asf@addu.edu.ph2/2

18-000ASF 1102NATIONAL SERVICE TRAINING PROGRAM - CIVIC WELFARE TRAINING SERVICE 1* 12:00P-1:30P C222 MW *NSTPLAST, NSTPFIRST
nstp@addu.edu.ph3/0

4-111CS 1232DISCRETE STRUCTURES 1* 3:30P-5:30P F333 M * 6:30P-8:30P F444B F *DSLAST, DSFIRST DSSECOND
ds@addu.edu.ph3/3

4-222CS 1233COMPUTER PROGRAMMING 2* 3:30P-5:30P Martin 444A W *CPLAST, CPFIRST
cpone@addu.edu.ph;cptwo@gmail.com4/5

16-111GE 1210READINGS IN PHILIPPINE HISTORY* 7:30A-9:00A F543E MW *3/3

16-222GE 1211THE CONTEMPORARY WORLD* 7:30A-9:00A F654 TTh *TCWLAST, TCWFIRST
tcw@addu.edu.ph3/3

16-333GE 1212SCIENCE, TECHNOLOGY AND SOCIETY* 9:00A-10:30A TBA MW *STSLAST, STSFIRST
sts@addu.edu.ph3/3

16-444PE 1215PATH-FIT II* 9:30A-12:00P F555 TTh *PELAST, PEFIRST
pe@addu.edu.ph2/2

50-000Theo 1000THEOLOGY* 2:30P-5:30P F456 TTh *THEOLAST, THEOFIRST, THEOSECOND
theo@addu.edu.ph3/3
`
