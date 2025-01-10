import { ScheduleTable } from '../process/arrange'
import { time_str } from '../process/parse'

function Schedule({ weekday_config, table }: ScheduleTable) {
  console.log(weekday_config)
  console.log(table)
  let out = ''

  // show weekday colors
  out += '\t'.repeat(1 + weekday_config.start)
  for (const color of weekday_config.colors) {
    out += color + '\t'
  }
  out += '\n'

  // show table
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

  return <textarea cols={100} rows={20} value={out} readOnly />
}

export default Schedule
