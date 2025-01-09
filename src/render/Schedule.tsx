import React from 'react'
import { ScheduleTable, TimeSlot } from '../process/arrange'

function Schedule({ table }: ScheduleTable) {
  // console.log(table)
  let out = ''
  for (const row of table) {
    for (const tile of row.columns) {
      // console.log(tile.colspan, tile.rowspan)
      const data = tile.data
      switch (data.type) {
        case 'subject':
          out += data.subject.code + '\t'
          // console.log(data.subject)
          break
        case 'bar':
          out += data.text + '\t'
          // console.log(data.text)
          break
        case 'empty':
          out += '\t'
          // console.log('empty')
          break
      }
      out += '\n'
    }
  }

  return <textarea cols={80} rows={20} value={out} readOnly />
}

export default Schedule
