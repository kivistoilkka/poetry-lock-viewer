import { useState } from 'react'

const App = () => {
  const [allPackages, setAllPackages] = useState({})

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
      reverseDependencies: [],
      installedDependency: true,
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
    return packageObject
  }

  const parseTOML = (text) => {
    const packagePart = text.split('[metadata]')[0]
    const individualPackages = packagePart.split('[[package]]').splice(1)
    const packageObjects = individualPackages.map((pckg) =>
      parsePackage(pckg.split('\n').splice(1))
    )
    const pckgs = {}
    packageObjects.forEach((pckg) => {
      pckgs[pckg.name] = {
        name: pckg.name,
        description: pckg.description,
        dependencies: pckg.dependencies,
        reverseDependencies: pckg.reverseDependencies,
        installedDependency: pckg.installedDependency,
      }
      pckg.dependencies.forEach((dependency) => {
        if (!pckgs[dependency.name]) {
          pckgs[dependency.name] = {
            name: dependency.name,
            description: '',
            dependencies: [],
            reverseDependencies: [],
            installedDependency: false,
          }
        }
        const oldRevDependencyArray = pckgs[dependency.name].reverseDependencies
        pckgs[dependency.name].reverseDependencies =
          oldRevDependencyArray.concat(dependency.reverseDependency)
      })
    })
    return pckgs
  }

  const handleFileOpen = (event) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setAllPackages(parseTOML(text))
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <div>
      <input type="file" onChange={handleFileOpen}></input>
      <p>
        {console.log(allPackages)}
        {Object.values(allPackages)
          .filter((pckg) => pckg.installedDependency)
          .sort((a, b) => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1
            }
            return 0
          })
          .map((pckg) => (
            <li key={pckg.name}>
              <b>{pckg.name}</b>: {pckg.description}
            </li>
          ))}
      </p>
    </div>
  )
}

export default App
