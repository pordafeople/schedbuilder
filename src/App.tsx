import { createContext, useState } from 'react'
import './App.css'
import { sample_text } from './input/sample_input'
import InputBox from './input/InputBox'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'
import Schedule from './render/Schedule'
import Classes from './render/Classes'
import { DisplayData, get_display_data } from './render/display_data'
import ImageRenderer from './output/ImageRenderer'

export const DisplayDataContext = createContext<DisplayData | null>(null)

function App() {
  const [text, setText] = useState(sample_text)

  const sis_data = parse_sis(text)
  const sis_table_data = arrange(sis_data)
  const display_data = get_display_data(sis_table_data)

  const { classes, schedule } = sis_table_data
  return (
    <DisplayDataContext.Provider value={display_data}>
      <h1>SchedBuilder</h1>
      <div>
        <h2>Input</h2>
        <InputBox text={text} setText={setText} />
      </div>
      <div>
        <h2>Rendering</h2>
        <div id="render-source" className="render-container">
          <h1>Schedule</h1>
          <Schedule {...schedule} />
          <Classes classes={classes} />
        </div>
      </div>
      <div>
        <h2>Image Renderer</h2>
        <ImageRenderer for="render-source" />
      </div>
    </DisplayDataContext.Provider>
  )
}

export default App
