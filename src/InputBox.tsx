import { useState } from 'react'

function InputBox() {
  const [text, setText] = useState('<insert name>')
  return (
    <textarea
      name="input_box"
      id="input_box"
      cols={80}
      rows={20}
      onChange={(e) => {
        console.log('changed: ', e.target.value)
        setText(e.target.value)
      }}
    >
      {text}
    </textarea>
  )
}

export default InputBox
