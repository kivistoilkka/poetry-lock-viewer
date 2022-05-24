import { useParams, Link } from 'react-router-dom'

const PackageInfo = ({ allPackages }) => {
  const name = useParams().name
  const packageToView = allPackages[name]

  if (!packageToView) {
    return (
      <div>
        <h2>Not found</h2>
        <p>
          Package <i>{name}</i> could not be found.
        </p>
      </div>
    )
  }

  const dependencies = Object.values(packageToView.dependencies).sort(
    (a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) {
        return -1
      }
      if (a.name.toLowerCase() > b.name.toLowerCase()) {
        return 1
      }
      return 0
    }
  )

  return (
    <div>
      <h2>{name}</h2>
      <p>{packageToView.description}</p>
      <p>
        <i>Dependencies:</i>
      </p>
      {dependencies
        .filter((d) => !d.optional)
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
        <i>Optional dependecies:</i>
      </p>
      {dependencies
        .filter((d) => d.optional)
        .map((pckg) =>
          allPackages[pckg.name].installedDependency ? (
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
