import { useState } from 'react'

const App = () => {
  const [packages, setPackages] = useState([])

  const parseExtras = (lines, reverseDependency) => {
    const endIndex = lines.indexOf('')
    const extrasLines = lines.slice(1, endIndex)
    const allExtras = extrasLines
      .map((line) => {
        const extrasListLine = line.split(' = ')[1]
        const extras = extrasListLine.slice(1, -1).split(', ')
        return extras.map((pckg) => {
          return pckg.split(' ')[0].replaceAll('"', '')
        })
      })
      .flat()
    const uniqueExtras = [...new Set(allExtras)]
    return uniqueExtras.map((pckg) => {
      return {
        name: pckg,
        optional: true,
        reverseDependency,
      }
    })
  }

  const parseDependencies = (lines, reverseDependency) => {
    const endIndex = lines.indexOf('')
    const dependencyLines = lines.slice(1, endIndex)
    const dependencies = dependencyLines.map((line) => {
      const name = line.split(' = ')[0]
      const optional = /(optional = true)/.test(line)
      return { name, optional, reverseDependency }
    })
    return dependencies
  }

  const parsePackage = (lines) => {
    const packageName = lines
      .find((line) => /^(name).*/.exec(line))
      .replace('name = "', '')
      .replace('"', '')
    const description = lines
      .find((line) => /^(description).*/.exec(line))
      .replace('description = "', '')
      .replace('"', '')
    const packageObject = {
      name: packageName,
      description: description,
    }

    const dependenciesIndex = lines.indexOf('[package.dependencies]')
    let dependencies = []
    if (dependenciesIndex >= 0) {
      dependencies = parseDependencies(
        lines.slice(dependenciesIndex),
        packageName
      )
    }
    const extrasIndex = lines.indexOf('[package.extras]')
    let extras = []
    if (extrasIndex >= 0) {
      extras = parseExtras(lines.slice(extrasIndex), packageName)
    }
    packageObject.dependencies = dependencies.concat(extras)
    console.log(packageObject)
    return packageObject
  }

  const parseTOML = (text) => {
    const packagePart = text.split('[metadata]')[0]
    const packages = packagePart.split('[[package]]').splice(1)
    return packages.map((pckg) => parsePackage(pckg.split('\n').splice(1)))
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
          <li key={pckg.name}>
            <b>{pckg.name}</b>: {pckg.description}
          </li>
        ))}
      </p>
    </div>
  )
}

export default App
