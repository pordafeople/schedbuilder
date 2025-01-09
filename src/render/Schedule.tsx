import React from 'react'
import { ScheduleTable, TimeSlot } from '../process/arrange'
import { time_str } from '../process/parse'

function Schedule({ table }: ScheduleTable) {
  console.log(table)
  let out = ''
  for (const row of table) {
    out += time_str(row.time) + ':\t'
    for (const tile of row.columns) {
      // console.log(tile.colspan, tile.rowspan)
      if (tile === null) {
        out += '[^^^^^]\t'
        continue
      }
      const data = tile.data
      switch (data.type) {
        case 'subject':
          out += '"' + data.subject.code + '"\t'
          // console.log(data.subject)
          break
        case 'bar':
          out += '"' + data.text + '"\t'
          // console.log(data.text)
          break
        case 'empty':
          out += '.\t'
          // console.log('empty')
          break
      }
    }
    out += '\n'
  }

  return <textarea cols={160} rows={20} value={out} readOnly />
}

export default Schedule
