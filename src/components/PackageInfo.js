import { useParams, Link } from 'react-router-dom'

const PackageInfo = ({ allPackages }) => {
  const name = useParams().name
  const packageToView = allPackages[name]

  const viewProjectLink = () => {
    if (packageToView.installedDependency) {
      return (
        <li key={name}>
          <b>
            <Link to={`/`}>Project</Link>
          </b>
        </li>
      )
    }
  }

  return (
    <div>
      <h2>{name}</h2>
      <p>{packageToView.description}</p>
      <p>
        <i>Dependencies:</i>
      </p>
      {Object.values(packageToView.dependencies)
        .sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1
          }
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1
          }
          return 0
        })
        .map((pckg) =>
          !pckg.optional || allPackages[pckg.name].installedDependency ? (
            <li key={pckg.name}>
              <Link to={`/packages/${pckg.name}`}>{pckg.name}</Link>
            </li>
          ) : (
            <li key={pckg.name}>{pckg.name}</li>
          )
        )}
      <p>
        <i>Reverse dependencies:</i>
      </p>
      {viewProjectLink()}
      {Object.values(packageToView.reverseDependencies)
        .sort()
        .map((name) => (
          <li key={name}>
            <Link to={`/packages/${name}`}>{name}</Link>
          </li>
        ))}
    </div>
  )
}

export default PackageInfo
