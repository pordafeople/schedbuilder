import { ClassDisplayData, ClassList } from '../process/arrange'
import './Classes.css'

function ClassDisplay({ class_data, color }: ClassDisplayData) {
  return (
    <tr
      key={class_data.code}
      className="class"
      style={{ backgroundColor: color.light }}
    >
      <td style={{ backgroundColor: color.normal }}>{class_data.code}</td>
      <td>{class_data.subject}</td>
      <td>{class_data.title}</td>
      <td>
        {class_data.teacher.family_name}, {class_data.teacher.given_name}
        <br />
        <label>
          {class_data.teacher.emails.map((email) => (
            <p>{email}</p>
          ))}
        </label>
      </td>
    </tr>
  )
}

export default function Classes({ classes }: { classes: ClassList }) {
  return (
    <table className="class-table">
      <tbody>{classes.map(ClassDisplay)}</tbody>
    </table>
  )
}
