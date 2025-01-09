import { useState } from 'react'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'

type InputBoxProps = {
  text: string
  setText: (value: string) => void
}

function InputBox({ text, setText }: InputBoxProps) {
  useState()
  return (
    <textarea
      name="input_box"
      id="input_box"
      cols={80}
      rows={20}
      value={text}
      onChange={(e) => {
        const value = e.target.value
        console.log('changed: ', value)
        const parsed = parse_sis(value)
        console.log('PARSED:', parsed)
        const arranged = arrange(parsed)
        console.log('ARRANGED:', arranged)
        setText(value)
      }}
    />
  )
}

export default InputBox
