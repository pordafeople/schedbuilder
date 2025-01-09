import { useState } from 'react'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'

function InputBox() {
  const [text, setText] = useState('<insert name>')
  return (
    <textarea
      name="input_box"
      id="input_box"
      cols={80}
      rows={20}
      onChange={(e) => {
        const value = e.target.value
        // console.log('changed: ', value)
        const parsed = parse_sis(value)
        console.log(parsed)
        const arranged = arrange(parsed)
        console.log(arranged)
        setText(value)
      }}
    >
      {text}
    </textarea>
  )
}

export default InputBox
