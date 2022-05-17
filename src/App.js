import { useState } from 'react'

const App = () => {
  const [packages, setPackages] = useState([])

  const parseTOML = (text) => {
    const packagePart = text.split('[metadata]')[0]
    const packages = packagePart.split('[[package]]').splice(1)
    return packages.map((pckg) => {
      const lines = pckg.split(/\r\n | \n/)
      const name = lines[0].split(' = "')[1].split('"')[0]
      return { name: name, info: pckg }
    })
  }

  const handleFileOpen = (event) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setPackages(parseTOML(text))
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <div>
      <input type="file" onChange={handleFileOpen}></input>
      <p>
        {packages.map((pckg) => (
          <li key={pckg.name}>{pckg.name}</li>
        ))}
      </p>
    </div>
  )
}

export default App
