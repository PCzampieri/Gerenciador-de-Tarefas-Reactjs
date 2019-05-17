import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {    
    primary: { 
      main: '#1565c0'      
    },
    secondary: { 
      main: '#f50057'       
    },
  }  
})  
export default theme
  