import html2canvas from 'html2canvas'

// from ChatGPT
const capture_and_download_image = (id: string) => {
  const element = document.getElementById(id)!

  html2canvas(element).then((canvas) => {
    const imageUrl = canvas.toDataURL('image/png')

    const link = document.createElement('a')
    link.href = imageUrl
    link.download = 'Schedule.png' // specify the file name
    link.click() // trigger the download
  })
}

function ImageRenderer({ for: target }: { for: string }) {
  return (
    <button onClick={() => capture_and_download_image(target)}>
      Download Screenshot
    </button>
  )
}

export default ImageRenderer
