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

function SlotDisplay({ tile }: { tile: TimeSlot }) {
  const { weekday, rowspan, colspan, duration, data } = tile
  const colors = useContext(DisplayDataContext)
  const bg_color =
    data.type === 'class'
      ? colors.classes[data.class_data.code].normal
      : data.type === 'bar'
      ? colors.bar_color
      : data.type === 'empty'
      ? colors.weekdays[weekday].light
      : '#f0f' // this should never happen

  const font_size = compute_font_size(duration) / 2
  return (
    <td
      key={weekday}
      className={`cell ${data.type}-cell ${
        data.type === 'class' && class_is_pe(data.class_data) ? 'pe' : ''
      }`}
      colSpan={colspan}
      rowSpan={rowspan}
      style={{
        backgroundColor: bg_color,
        fontSize: `${font_size}vw`,
      }}
    >
      {data.type === 'class' ? (
        <>
          <p className="class-text">{data.class_data.subject}</p>
          <p className="class-code">{data.class_period.room}</p>
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
      {columns
        .filter((slot) => slot !== null)
        .map((tile) => (
          <SlotDisplay key={tile.weekday} tile={tile} />
        ))}
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
