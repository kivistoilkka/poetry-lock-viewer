import {
  TableContainer,
  Table,
  TableBody,
  Paper,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'

const PackageList = ({ allPackages }) => {
  const sortedPackages = Object.values(allPackages)
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

  const renderPackageLine = (pckg) => {
    if (pckg.installedDependency) {
      return (
        <TableRow key={pckg.name}>
          <TableCell>
            <Link to={`/packages/${pckg.name}`}>
              <b>{pckg.name}</b>
            </Link>
          </TableCell>
          <TableCell>{pckg.description}</TableCell>
        </TableRow>
      )
    }
    return (
      <li key={pckg.name}>
        <b>{pckg.name}</b>: {pckg.description}
      </li>
    )
  }

  const renderPackageList = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {sortedPackages.map((pckg) => renderPackageLine(pckg))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }
  return (
    <div>
      <Typography variant="h4" component="h2">
        Installed packages
      </Typography>

      {Object.keys(allPackages).length > 0 ? (
        renderPackageList()
      ) : (
        <Typography variant="body1" component="div">
          Please select the file
        </Typography>
      )}
    </div>
  )
}

export default PackageList
