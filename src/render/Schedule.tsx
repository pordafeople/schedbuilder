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
  const display_data = useContext(DisplayDataContext)
  const { class_name, bg_color } =
    time.hour < 12
      ? { class_name: 'timeAM', bg_color: display_data.time_colors.am }
      : { class_name: 'timePM', bg_color: display_data.time_colors.pm }
  return (
    <td className={`time ${class_name}`} style={{ backgroundColor: bg_color }}>
      {time_str(time)}
    </td>
  )
}

function TimeSlotDisplay(tile: TimeSlot | null) {
  if (tile === null) {
    return null
  }
  const { weekday, rowspan, colspan, data } = tile
  const colors = useContext(DisplayDataContext)
  const bg_color =
    data.type === 'class'
      ? colors.classes[data.class_code]?.normal || '#4ff'
      : data.type === 'bar'
      ? colors.bar_color
      : data.type === 'empty'
      ? colors.weekdays[weekday].light
      : '#0ff' // this should never happen

  return (
    <td
      key={weekday}
      className={`${data.type}-cell`}
      colSpan={colspan || 1}
      rowSpan={rowspan || 1}
      style={{ backgroundColor: bg_color }}
    >
      {data.type === 'class' ? (
        <div className="class-code">
          <p>{data.class_code}</p>
        </div>
      ) : data.type === 'bar' ? (
        <div className="bar-text">{data.text}</div>
      ) : (
        <span className="empty-dot"></span>
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
            style={{
              backgroundColor: colors?.weekdays[day].normal,
            }}
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
