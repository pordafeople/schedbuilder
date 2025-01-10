import { ScheduleTable } from '../process/arrange'
import { time_str } from '../process/parse'
import { WEEKDAYS } from './../process/parse';
import './Schedule.css'

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

  return (
    <div>
        <textarea cols={160} rows={20} value={out} readOnly />
        <div className="schedule-container">
      <table className="main-container">
        {/* Header Row */}
        <thead>
          <tr className="border-bottom">
            <th className="empty"></th>
            {WEEKDAYS.map((day, index) => (
              <th key={index} className="weekday-header">{day}</th>
            ))}
          </tr>
        </thead>
        {/* Table Body */}
        <tbody>
          {table.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {/* Time Column */}
              <td className={`time ${row.time.hour < 12 ? 'timeAM' : 'timePM'}`}>
                {time_str(row.time)}
              </td>
              {/* Data Columns */}
              {row.columns.map((tile, colIndex) => {
                if (!tile) {
                  return null;
                }
                const { data } = tile;
                const classes = data.type === 'class' ? 'class-cell' : data.type === 'bar' ? 'bar-cell' : 'empty-cell';
                return (
                  <td
                    key={colIndex}
                    className={classes}
                    colSpan={tile.colspan || 1}
                    rowSpan={tile.rowspan || 1}
                  >
                    {data.type === 'class' ? (
                      <>
                        <div className="class-code">{data.class_code}</div>
                      </>
                    ) : data.type === 'bar' ? (
                      <div className="bar-text">{data.text}</div>
                    ) : (
                      <span className="empty-dot">.</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  
)
}

export default Schedule
