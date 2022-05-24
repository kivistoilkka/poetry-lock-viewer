import { useState } from 'react'
import {
  List,
  ListSubheader,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useParams, Link } from 'react-router-dom'

const PackageInfo = ({ allPackages }) => {
  const [openDependencies, setOpenDependencies] = useState(false)
  const [openOptional, setOpenOptional] = useState(false)
  const [openReverse, setOpenReverse] = useState(false)

  const name = useParams().name
  const packageToView = allPackages[name]

  if (!packageToView) {
    return (
      <div>
        <Typography variant="h4" component="h2">
          Not found
        </Typography>
        <Typography variant="body1" component="div">
          Package <i>{name}</i> could not be found.
        </Typography>
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
      <Typography variant="h4" component="h2">
        {name}
      </Typography>
      <Typography variant="body1" component="div">
        {packageToView.description}
      </Typography>

      <List
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Package dependencies
          </ListSubheader>
        }
      >
        <ListItemButton onClick={() => setOpenDependencies(!openDependencies)}>
          <ListItemText primary="Dependencies" />
          {openDependencies ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openDependencies} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {dependencies
              .filter((d) => !d.optional)
              .map((pckg) => (
                <ListItemButton sx={{ pl: 4 }} key={pckg.name}>
                  <ListItemText
                    primary={
                      <Link to={`/packages/${pckg.name}`}>{pckg.name}</Link>
                    }
                  />
                </ListItemButton>
              ))}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenOptional(!openOptional)}>
          <ListItemText primary="Optional dependencies" />
          {openOptional ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openOptional} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {dependencies
              .filter((d) => d.optional)
              .map((pckg) =>
                allPackages[pckg.name].installedDependency ? (
                  <ListItemButton sx={{ pl: 4 }} key={pckg.name}>
                    <ListItemText
                      primary={
                        <Link to={`/packages/${pckg.name}`}>{pckg.name}</Link>
                      }
                    />
                  </ListItemButton>
                ) : (
                  <ListItemButton sx={{ pl: 4 }} key={pckg.name}>
                    <ListItemText primary={pckg.name} />
                  </ListItemButton>
                )
              )}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setOpenReverse(!openReverse)}>
          <ListItemText primary="Reverse dependencies" />
          {openReverse ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openReverse} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {Object.values(packageToView.reverseDependencies)
              .sort()
              .map((name) => (
                <ListItemButton sx={{ pl: 4 }} key={name}>
                  <ListItemText
                    primary={<Link to={`/packages/${name}`}>{name}</Link>}
                  />
                </ListItemButton>
              ))}
          </List>
        </Collapse>
      </List>
    </div>
  )
}

export default PackageInfo
