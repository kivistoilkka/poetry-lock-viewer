import { useState } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from 'react-router-dom'
import {
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Input,
  createTheme,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { teal, green } from '@mui/material/colors'
import PackageList from './components/PackageList'
import PackageInfo from './components/PackageInfo'
import parseTOML from './utils/parser'

const App = () => {
  const [allPackages, setAllPackages] = useState({})

  const theme = createTheme({
    palette: {
      primary: teal,
      secondary: green,
    },
  })

  const handleFileOpen = (event) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target.result
      setAllPackages(parseTOML(text))
    }
    reader.readAsText(event.target.files[0])
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Router>
          <div>
            <AppBar position="static">
              <Toolbar>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                ></IconButton>
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
                <Input
                  variant="contained"
                  type="file"
                  accept=".lock"
                  onChange={handleFileOpen}
                ></Input>
              </Toolbar>
            </AppBar>
          </div>

          <Typography variant="h3" component="h1">
            Poetry lock file viewer
          </Typography>

          <Routes>
            <Route
              path="/"
              element={<PackageList allPackages={allPackages} />}
            />
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
      </Container>
    </ThemeProvider>
  )
}

export default App
