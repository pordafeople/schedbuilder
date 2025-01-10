import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'

// Partially from ChatGPT
function ImageRenderer({ for: target }: { for: string }) {
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null) // To store the data URL of the generated canvas

  const capture_and_show_canvas = () => {
    // Capture the DOM element using html2canvas
    const element = document.getElementById(target)!
    console.log(element)
    html2canvas(element).then((canvas) => {
      // Convert the canvas to a data URL (image format)
      const imageUrl = canvas.toDataURL('image/png')
      setCanvasUrl(imageUrl) // Set the data URL to state to display it
    })
  }

  return (
    <div>
      <button onClick={() => capture_and_show_canvas()}>
        Render to Image!
      </button>
      <br />
      {canvasUrl && (
        <div>
          <h3 style={{ display: 'inline' }}>Generated Image: </h3>
          <button>Download</button>
          <br />
          <img src={canvasUrl} alt="Captured Canvas" />
        </div>
      )}
    </div>
  )
}

export default ImageRenderer
