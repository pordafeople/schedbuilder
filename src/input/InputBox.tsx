import { sample_text } from './sample_input'

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
        rows={24}
        value={text}
        placeholder={sample_text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  )
}

export default InputBox
