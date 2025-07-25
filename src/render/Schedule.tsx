import { PropsWithChildren, useContext } from 'react'
import { DisplayDataContext } from '../App'
import './Schedule.css'
import {
  class_is_pe,
  Time,
  time_is_noon,
  time_str,
  TimeMinutes,
  Weekday,
  WEEKDAYS,
} from '../process/parse'
import {
  ScheduleRow,
  ScheduleTable,
  TimeSlot,
  WeekdayConfig,
} from '../process/arrange'

function compute_height(duration: TimeMinutes): number {
  return duration / 16
}

function compute_font_size(duration: TimeMinutes): number {
  return Math.min(90, duration) / 30
  // return Math.min(30, duration) / 60
}

function TimeDisplay({
  time,
  duration,
  children,
}: PropsWithChildren<{
  time: Time
  duration: TimeMinutes
}>) {
  const display_data = useContext(DisplayDataContext)
  const font_size = compute_font_size(duration * 2) / 2
  const { class_name, bg_color } =
    time.hour < 12
      ? { class_name: 'timeAM', bg_color: display_data.time_colors.am }
      : { class_name: 'timePM', bg_color: display_data.time_colors.pm }
  return (
    <>
      <td
        className={`cell time ${class_name}`}
        style={{
          backgroundColor: bg_color,
          fontSize: `${font_size}vw`,
        }}
      >
        {children}
      </td>
    </>
  )
}

function SlotDisplay({ tile, is_edge }: { tile: TimeSlot; is_edge: boolean }) {
  const { weekday, rowspan, colspan, duration, data } = tile
  const colors = useContext(DisplayDataContext)
  const class_name = `cell ${data.type}-cell ${
    data.type === 'class' && class_is_pe(data.class_data) ? 'pe' : ''
  } ${is_edge ? 'right-edge' : ''}`
  const bg_color =
    data.type === 'class'
      ? colors.classes[data.class_data.code].normal
      : data.type === 'bar'
      ? colors.bar_color
      : data.type === 'empty'
      ? colors.weekdays[weekday].light
      : '#f0f' // this should never happen

  let font_size = compute_font_size(duration) / 2
  let separator = <br />
  let inline = duration < 60
  if (inline) {
    font_size *= 1.5
    separator = <span> </span>
  }
  return (
    <td
      key={weekday}
      className={class_name}
      colSpan={colspan}
      rowSpan={rowspan}
      style={{
        backgroundColor: bg_color,
      }}
    >
      {data.type === 'class' ? (
        <>
          <p
            className="class-text"
            style={{
              fontSize: `${font_size * 0.75}vw`,
            }}
          >
            <span
              className="class-text"
              style={{
                fontSize: `${font_size}vw`,
              }}
            >
              {data.class_data.subject}
            </span>
            {separator}
            <span className="class-code">{data.class_period.room}</span>
            {separator}
            <span className="class-time">
              {time_str(data.class_period.start)}-
              {time_str(data.class_period.end)}
            </span>
          </p>
        </>
      ) : data.type === 'bar' ? (
        <p className="bar-text">{data.text}</p>
      ) : data.type === 'empty' ? (
        <span className="empty-dot"></span>
      ) : null}
    </td>
  )
}

function RowDisplay({ time, duration, columns }: ScheduleRow) {
  const height = `${compute_height(duration)}vw`
  return (
    <tr
      className={time_is_noon(time) ? 'noon' : ''}
      style={{
        minHeight: height,
        height,
        maxHeight: height,
      }}
    >
      <TimeDisplay time={time} duration={duration}>
        <label>{time_str(time)}</label>
      </TimeDisplay>
      {columns.map((tile, index, arr) =>
        // NOTE: does not respect WeekdayConfig yet
        tile !== null ? (
          <SlotDisplay
            key={tile.weekday}
            tile={tile}
            is_edge={index === arr.length - 1}
          />
        ) : null,
      )}
    </tr>
  )
}

function WeekdaysHeader({
  time,
  config,
}: {
  time: Time
  config: WeekdayConfig
}) {
  const display_data = useContext(DisplayDataContext)
  const is_pe_day = (day: Weekday) => config.pe_days.has(day)
  return (
    <thead>
      <tr className="border-bottom">
        <TimeDisplay time={time} duration={0} />
        {WEEKDAYS.map((weekday) => (
          <th
            key={weekday}
            className={`weekday-header${is_pe_day(weekday) ? ' pe' : ''}`}
            style={{
              backgroundColor: display_data.weekdays[weekday].normal,
            }}
          >
            {/* <p>{`${weekday}${is_pe_day(weekday) ? ' (PE)' : ''}`}</p> */}
            <p>{weekday}</p>
          </th>
        ))}
      </tr>
    </thead>
  )
}

function Schedule({ weekday_config, table }: ScheduleTable) {
  return (
    <div className="schedule-container">
      <table className="main-container">
        <WeekdaysHeader time={table[0].time} config={weekday_config} />
        <tbody>
          {table.map((row) => (
            <RowDisplay key={time_str(row.time)} {...row} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Schedule
