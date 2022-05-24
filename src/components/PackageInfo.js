import {
  TableBody,
  TableContainer,
  Table,
  TableRow,
  Paper,
  TableCell,
} from '@mui/material'
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
        <b>
          <i>Dependencies:</i>
        </b>
      </p>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {dependencies
              .filter((d) => !d.optional)
              .map((pckg) => (
                <TableRow key={pckg.name}>
                  <TableCell>
                    <Link to={`/packages/${pckg.name}`}>{pckg.name}</Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <p>
        <b>
          <i>Optional dependecies:</i>
        </b>
      </p>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {dependencies
              .filter((d) => d.optional)
              .map((pckg) =>
                allPackages[pckg.name].installedDependency ? (
                  <TableRow key={pckg.name}>
                    <TableCell>
                      <Link to={`/packages/${pckg.name}`}>{pckg.name}</Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={pckg.name}>
                    <TableCell>{pckg.name}</TableCell>
                  </TableRow>
                )
              )}
          </TableBody>
        </Table>
      </TableContainer>

      <p>
        <b>
          <i>Reverse dependencies:</i>
        </b>
      </p>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {Object.values(packageToView.reverseDependencies)
              .sort()
              .map((name) => (
                <TableRow key={name}>
                  <TableCell>
                    <Link to={`/packages/${name}`}>{name}</Link>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default PackageInfo
