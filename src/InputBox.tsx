import { useState } from 'react'
import { parse_sis } from './parser'

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
        console.log(parse_sis(value))
        setText(value)
      }}
    >
      {text}
    </textarea>
  )
}

export default InputBox
