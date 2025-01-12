import { useContext } from 'react'
import { DisplayDataContext } from '../App'
import './Classes.css'
import { ClassData } from '../process/parse'
import { ClassList } from '../process/arrange'

function ClassDisplay({ code, subject, title, teacher }: ClassData) {
  const color = useContext(DisplayDataContext).classes[code] ?? {
    light: '#aaa',
    normal: '#888',
  }

  return (
    <tr key={code} className="class" style={{ backgroundColor: color.light }}>
      <td style={{ backgroundColor: color.normal }}>{code}</td>
      <td>{subject}</td>
      <td>{title}</td>
      <td>
        <p className="teacher-name">
          {teacher.family_name}, {teacher.given_name}
        </p>
        {teacher.emails.map((email) => (
          <p key={email} className="teacher-email">
            {email}
          </p>
        ))}
      </td>
    </tr>
  )
}

function Classes({ classes }: { classes: ClassList }) {
  return (
    <table className="class-table">
      <tbody>{classes.map(ClassDisplay)}</tbody>
    </table>
  )
}

export default Classes
