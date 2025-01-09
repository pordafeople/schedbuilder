import { useState } from 'react'

type InputBoxProps = {
  text: string
  setText: (value: string) => void
}

function InputBox({ text, setText }: InputBoxProps) {
  return (
    <textarea
      name="input_box"
      id="input_box"
      cols={160}
      rows={20}
      value={text}
      onChange={(e) => {
        const value = e.target.value
        console.log('changed: ', value)
        setText(value)
      }}
    />
  )
}

export default InputBox
