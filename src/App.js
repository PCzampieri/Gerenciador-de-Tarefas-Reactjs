import React from 'react'
import Routes from './routes'
import { MuiThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import theme from '../src/theme'

function App() { 
  return (
    <React.Fragment>
      <CssBaseline /> 
      <MuiThemeProvider theme={theme}>
        <Routes />      
      </MuiThemeProvider> 
    </React.Fragment>
  )
}
export default App


