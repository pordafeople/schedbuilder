type InputBoxProps = {
  text: string
  setText: (value: string) => void
}

function InputBox({ text, setText }: InputBoxProps) {
  return (
    <div className="textArena-container">
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
    </div>
    
  )
}

export default InputBox
