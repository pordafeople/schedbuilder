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
        case 'class':
          out += '"' + data.class_code + '"\t'
          break
        case 'bar':
          out += '"' + data.text + '"\t'
          break
        case 'empty':
          out += '.\t'
          break
      }
    }
    out += '\n'
  }

  return <textarea cols={160} rows={20} value={out} readOnly />
}

export default Schedule
