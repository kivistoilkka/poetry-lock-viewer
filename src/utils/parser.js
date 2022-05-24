const parseExtras = (lines, dependencyNames) => {
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
  const filteredExtras = uniqueExtras.filter(
    (extra) => !dependencyNames.includes(extra)
  )
  return filteredExtras.map((pckg) => {
    return {
      name: pckg.toLowerCase(),
      optional: true,
    }
  })
}

const parseDependencies = (lines) => {
  const endIndex = lines.indexOf('')
  const dependencyLines = lines.slice(1, endIndex)
  const dependencies = dependencyLines.map((line) => {
    const name = line.split(' = ')[0].toLowerCase().replaceAll('"', '')
    const optional = /(optional = true)/.test(line)
    return { name, optional }
  })
  return dependencies
}

const parsePackage = (lines) => {
  const packageName = lines
    .find((line) => /^(name = ).*/.exec(line))
    .replace('name = "', '')
    .replace('"', '')
    .toLowerCase()
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
    dependencies = parseDependencies(lines.slice(dependenciesIndex))
  }
  const extrasIndex = lines.indexOf('[package.extras]')
  let extras = []
  if (extrasIndex >= 0) {
    extras = parseExtras(
      lines.slice(extrasIndex),
      dependencies.map((d) => d.name)
    )
  }

  return { ...packageObject, dependencies: dependencies.concat(extras) }
}

const parseTOML = (text) => {
  const packagePart = text.split('[metadata]')[0]
  const individualPackages = packagePart.split('[[package]]').splice(1)
  const packageObjects = individualPackages.map((pckg) =>
    parsePackage(pckg.split('\n').splice(1))
  )
  const pckgs = {}
  packageObjects.forEach((pckg) => {
    if (!pckgs[pckg.name])
      pckgs[pckg.name] = {
        name: pckg.name,
        description: pckg.description,
        dependencies: pckg.dependencies,
        reverseDependencies: [],
        installedDependency: true,
      }
    else {
      pckgs[pckg.name] = {
        ...pckgs[pckg.name],
        description: pckg.description,
        dependencies: pckg.dependencies,
        installedDependency: true,
      }
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
      pckgs[dependency.name] = {
        ...pckgs[dependency.name],
        reverseDependencies: pckgs[dependency.name].reverseDependencies.concat(
          pckg.name
        ),
      }
    })
  })
  return pckgs
}

module.exports = parseTOML
