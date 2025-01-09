import { useState } from 'react'

function Subject() {
  const [name, _setName] = useState('<insert name>')
  return <div>Hello {name}!</div>
}

export default Subject
