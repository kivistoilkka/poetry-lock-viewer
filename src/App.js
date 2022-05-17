import { useState } from 'react'

const App = () => {
  const handleFileOpen = (event) => {
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      console.log(text)
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <div>
      <input type="file" onChange={handleFileOpen}></input>
    </div>
  )
}

export default App
