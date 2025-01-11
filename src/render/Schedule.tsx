import { useContext } from 'react'
import { DisplayDataContext } from '../App'
import './Schedule.css'
import { Time, time_str, TimeMinutes, WEEKDAYS } from '../process/parse'
import {
  ScheduleRow,
  ScheduleTable,
  TimeSlot,
  WeekdayConfig,
} from '../process/arrange'

function compute_height(duration: TimeMinutes): number {
  return duration / 20
}

function compute_font_size(duration: TimeMinutes): number {
  return Math.min(60, duration) / 60
  // return Math.min(30, duration) / 60
}

function TimeDisplay(time: Time) {
  const display_data = useContext(DisplayDataContext)
  const { class_name, bg_color } =
    time.hour < 12
      ? { class_name: 'timeAM', bg_color: display_data.time_colors.am }
      : { class_name: 'timePM', bg_color: display_data.time_colors.pm }
  return (
    <td
      className={`cell time ${class_name}`}
      style={{ backgroundColor: bg_color }}
    >
      <p>{time_str(time)}</p>
    </td>
  )
}

function TimeSlotDisplay({ tile }: { tile: TimeSlot }) {
  const { weekday, rowspan, colspan, duration, data } = tile
  const colors = useContext(DisplayDataContext)
  const bg_color =
    data.type === 'class'
      ? colors.classes[data.class_data.code]?.normal || '#0ff'
      : data.type === 'bar'
      ? colors.bar_color
      : data.type === 'empty'
      ? colors.weekdays[weekday].light
      : '#f0f' // this should never happen

  return (
    <td
      key={weekday}
      className={`cell ${data.type}-cell`}
      colSpan={colspan}
      rowSpan={rowspan}
      style={{
        backgroundColor: bg_color,
        fontSize: `${compute_font_size(duration)}vw`,
      }}
    >
      {data.type === 'class' ? (
        <>
          <p className="class-text">{data.class_data.subject}</p>
          <p className="class-code">{data.class_period.room}</p>
        </>
      ) : data.type === 'bar' ? (
        <p className="bar-text">{data.text}</p>
      ) : (
        <span className="empty-dot"></span>
      )}
    </td>
  )
}

function ScheduleRowDisplay({ time, duration, columns }: ScheduleRow) {
  const height = `${compute_height(duration)}vw`
  const font_size = `${compute_font_size(duration) * 1.5}vw`
  return (
    <tr
      style={{
        minHeight: height,
        height,
        maxHeight: height,
        fontSize: font_size,
      }}
    >
      <TimeDisplay {...time} />
      {columns
        .filter((slot) => slot !== null)
        .map((tile) => (
          <TimeSlotDisplay key={tile.weekday} tile={tile} />
        ))}
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
              backgroundColor: colors.weekdays[day].normal,
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
          <tbody>
            {table.map((row) => (
              <ScheduleRowDisplay key={time_str(row.time)} {...row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Schedule
