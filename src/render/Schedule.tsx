import React from 'react'
import { ScheduleTable, TimeSlot } from '../process/arrange'

function Schedule({ table }: ScheduleTable) {
  console.log(table)
  for (const row of table) {
    for (const tile of row.columns) {
      console.log(tile.colspan, tile.rowspan)
      const data = tile.data
      switch (data.type) {
        case 'subject':
          console.log(data.subject)
          break
        case 'bar':
          console.log(data.text)
          break
        case 'empty':
          console.log('empty')
          break
      }
    }
  }

  return <h1>hello world</h1>
}

export default Schedule
