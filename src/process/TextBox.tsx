function TextBox({ text }: { text: string }) {
  const lines = text.split('\n').length
  const rows = Math.min(lines, 12)
  return <textarea rows={rows} value={text} readOnly />
}

export default TextBox
