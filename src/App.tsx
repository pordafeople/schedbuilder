import { createContext, useContext, useState } from 'react'
import './App.css'
import InputBox from './input/InputBox'
import Schedule from './render/Schedule'
import Classes from './render/Classes'
import ImageRenderer from './output/ImageRenderer'
import { parse_sis } from './process/parse'
import { arrange } from './process/arrange'
import { sample_text } from './input/sampleinput'
import { DisplayData, get_display_data } from './render/DisplayData'

export const DisplayDataContext = createContext<DisplayData | null>(null)

function App() {
  const [text, setText] = useState(sample_text)

  const sisData = parse_sis(text)
  const sisTableData = arrange(sisData)
  const { classes, schedule } = sisTableData

  const [displayData, setDisplayData] = useState(get_display_data(sisTableData))

  return (
    <DisplayDataContext.Provider value={displayData}>
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
