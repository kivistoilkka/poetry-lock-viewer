import { Link } from 'react-router-dom'

const PackageList = ({ allPackages }) => {
  const renderPackageLine = (pckg) => {
    if (pckg.installedDependency) {
      return (
        <li key={pckg.name}>
          <Link to={`/packages/${pckg.name}`}>
            <b>{pckg.name}</b>
          </Link>
          : {pckg.description}
        </li>
      )
    }
    return (
      <li key={pckg.name}>
        <b>{pckg.name}</b>: {pckg.description}
      </li>
    )
  }

  const renderPackageList = () => {
    return Object.values(allPackages)
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
      .map((pckg) => renderPackageLine(pckg))
  }
  return (
    <div>
      <h2>Installed packages</h2>
      {Object.keys(allPackages).length > 0 ? (
        renderPackageList()
      ) : (
        <p>Please select the file</p>
      )}
    </div>
  )
}

export default PackageList
