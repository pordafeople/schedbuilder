import { ClassDisplayData, ClassList } from '../process/arrange'
import './Classes.css'

function ClassDisplay({ class_data, color }: ClassDisplayData) {
  return (
    <tr
      key={class_data.code}
      className="class"
      style={{ backgroundColor: color }}
    >
      <td>{class_data.code}</td>
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
