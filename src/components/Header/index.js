import React,{ useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import { isAuthenticated, removeJwt, getUser } from'../../services/auth'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuHome: {
    display: 'flex',
    marginRight: 20,   
    alignItems: 'Left'   
  }
};

function Header(props) {
  const { classes } = props

  const [isLogged, setIsLogged] = useState(false)
  const [user, setUser] = useState('')    

  useEffect(() => {    
    if ( isAuthenticated()) {    
      const user = getUser()      
      setIsLogged(true) 
      setUser(user.nome)          
    }
  }, [])

  const handleOnclickSair = () => {
    removeJwt()    
    setIsLogged(false)            
}     
  return (
    <div className={classes.root}>
      <AppBar position='static' color='primary'> 
        <Toolbar>         
          <Typography component={Link} to='/' variant='h6' color='inherit' className={classes.grow} style={{ textDecoration: 'none' }}>
            Gerenciador de Tarefas 
          </Typography>
          <Button component={Link} to='/' variant='h6' color='inherit' className={classes.menuHome}>
            Home
          </Button>
          <Button component={Link} to='/sobre' variant='h6' color='inherit' className={classes.menuHome}>
            Sobre
          </Button>
          { isLogged && <Typography variant='h6' color='inherit'>{user}</Typography> }&nbsp;&nbsp;
          { !isLogged && 
              <div>
              <Button variant='outlined'  component={Link} to='/login' color='inherit'>Login</Button>&nbsp;&nbsp;
              <Button variant='contained'  component={Link} to='/cadastro' color='secondary'>Cadastre-se</Button>  
              </div>
          }
          { isLogged && 
              <Button variant='outlined' 
                          onClick={handleOnclickSair} 
                          component={Link} to='/' 
                          color='inherit'>Sair
              </Button>}&nbsp;&nbsp;            
        </Toolbar>
      </AppBar>
    </div>
  )
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Header)