import html2canvas from 'html2canvas'
import { useRef, useState } from 'react'

// Partially from ChatGPT
function ImageRenderer({ for: target }: { for: string }) {
  const [canvasUrl, setCanvasUrl] = useState<string | null>(null) // To store the data URL of the generated canvas

  const render_image = () => {
    // Capture the DOM element using html2canvas
    const element = document.getElementById(target)
    if (element === null) {
      console.log(
        `Attempted to render to canvas, but target ID '${target}' did not exist.`
      )
      return
    }
    console.log(element)
    html2canvas(element).then((canvas) => {
      // Convert the canvas to a data URL (image format)
      const imageUrl = canvas.toDataURL('image/png')
      setCanvasUrl(imageUrl) // Set the data URL to state to display it
    })
  }

  // Handle the button click to download the canvas image
  const download_image = () => {
    if (canvasUrl === null) {
      console.log(`Attempted to download from a nonexistent canvas.`)
      return
    }

    // Create a temporary download link
    const link = document.createElement('a')
    link.href = canvasUrl
    link.download = 'Schedule.png' // Specify the image file name
    link.click() // Trigger the download
  }

  return (
    <div>
      <button onClick={() => render_image()}>Render to Image!</button>
      {canvasUrl && (
        <>
          <div>
            <h3 style={{ display: 'inline' }}>Generated Image: </h3>
            <button onClick={download_image}>Download Image!</button>
            <br />
            <img src={canvasUrl} alt="Captured Canvas" />
          </div>
        </>
      )}
    </div>
  )
}

export default ImageRenderer
