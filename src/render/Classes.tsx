import { ClassDisplayData, ClassList } from '../process/arrange'
import './Classes.css'

function ClassDisplay({ class_data, color }: ClassDisplayData, index: number) {
  return (
    <tr key={index} className="class" style={{ backgroundColor: color }}>
      <td>{class_data.subject}</td>
      <td>{class_data.title}</td>
      <td>{class_data.teacher.given_name}<br /><label>{class_data.teacher.emails}</label></td>
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
