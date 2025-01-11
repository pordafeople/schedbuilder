import { useContext } from 'react'
import { DisplayDataContext } from '../App'
import './Schedule.css'
import { Time, time_str, WEEKDAYS } from '../process/parse'
import {
  ScheduleRow,
  ScheduleTable,
  TimeSlot,
  WeekdayConfig,
} from '../process/arrange'

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
  const colors = useContext(DisplayDataContext)

  const { weekday, rowspan, colspan, data } = tile
  return (
    <td
      key={weekday}
      className={`${data.type}-cell`}
      colSpan={colspan || 1}
      rowSpan={rowspan || 1}
      style={
        data.type === 'class'
          ? { backgroundColor: colors?.classes[data.class_code].normal }
          : {}
      }
    >
      {data.type === 'class' ? (
        <div className="class-code">
          <p>{data.class_code}</p>
        </div>
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
  const colors = useContext(DisplayDataContext)
  // { start, end }
  return (
    <thead>
      <tr className="border-bottom">
        <th className="empty"></th>
        {WEEKDAYS.map((day) => (
          <th
            key={day}
            className="weekday-header"
            style={{ backgroundColor: colors?.weekdays[day].normal }}
          >
            <p>{day}</p>
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
