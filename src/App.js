import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import PackageList from './components/PackageList'
import PackageInfo from './components/PackageInfo'
import parseTOML from './utils/parser'

const App = () => {
  const [allPackages, setAllPackages] = useState({})

  const padding = {
    padding: 5,
  }

  const handleFileOpen = (event) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setAllPackages(parseTOML(text))
    }
    reader.readAsText(event.target.files[0])
  }

  // REMEMBER TO REMOVE! ////////////////////////////////////////////////////////////
  console.log(allPackages)
  ///////////////////////////////////////////////////////////////////////////////////

  return (
    <Router>
      <h1>Poetry package dependency viewer</h1>
      <div>
        <Link style={padding} to="/">
          Home
        </Link>
        <input style={padding} type="file" onChange={handleFileOpen}></input>
      </div>

      <Routes>
        <Route path="/" element={<PackageList allPackages={allPackages} />} />
        <Route
          path="/packages/:name"
          element={
            Object.keys(allPackages).length > 0 ? (
              <PackageInfo allPackages={allPackages} />
            ) : (
              <Navigate replace to="/" />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
