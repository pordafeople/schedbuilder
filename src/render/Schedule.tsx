import {
  ScheduleRow,
  ScheduleTable,
  TimeSlot,
  WeekdayConfig,
} from '../process/arrange'
import { Time, time_str, Weekday } from '../process/parse'
import { WEEKDAYS } from './../process/parse'
import './Schedule.css'

function TimeDisplay(time: Time) {
  return (
    <td className={`time ${time.hour < 12 ? 'timeAM' : 'timePM'}`}>
      {time_str(time)}
    </td>
  )
}

function TimeSlotDisplay(tile: TimeSlot | null) {
  if (tile === null) {
    return null
  }

  const { data } = tile
  const classes =
    data.type === 'class'
      ? 'class-cell'
      : data.type === 'bar'
      ? 'bar-cell'
      : 'empty-cell'

  return (
    <td
      key={tile.weekday}
      className={classes}
      colSpan={tile.colspan || 1}
      rowSpan={tile.rowspan || 1}
    >
      {data.type === 'class' ? (
        <div className="class-code">{data.class_code}</div>
      ) : data.type === 'bar' ? (
        <div className="bar-text">{data.text}</div>
      ) : (
        <span className="empty-dot">.</span>
      )}
    </td>
  )
}

function ScheduleRowDisplay(row: ScheduleRow) {
  return (
    <tr key={time_str(row.time)}>
      <TimeDisplay {...row.time} />
      {row.columns.map(TimeSlotDisplay)}
    </tr>
  )
}

function WeekdaysHeader(_config: WeekdayConfig) {
  // { start, end, colors }
  return (
    <thead>
      <tr className="border-bottom">
        <th className="empty"></th>
        {WEEKDAYS.map((day, index) => (
          <th key={index} className="weekday-header">
            {day}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function Schedule({ weekday_config, table }: ScheduleTable) {
  return (
    <div>
      <div className="schedule-container">
        <table className="main-container">
          <WeekdaysHeader {...weekday_config} />
          <tbody>{table.map(ScheduleRowDisplay)}</tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule
