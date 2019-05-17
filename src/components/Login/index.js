import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import withStyles from '@material-ui/core/styles/withStyles'

import { Redirect } from 'react-router-dom'
import axios from '../../services/api'
import { getJwt, loginOk  } from '../../services/auth'
import Header from '../Header'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function Login(props) {
  const { classes } = props

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [errorValid, setErrorValid] = useState([])
  const [isErrorValid, setIsErrorValid] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [isLogged, setIsLogged] = useState(false)    

    useEffect(()=> {
        const logged = getJwt()
        if(logged){
            setIsLogged(true)
        }        
    }, [])

    const handleSubmit = async(e) => {
        e.preventDefault()
        try {
            const login = await axios.post('/usuarios/login', { email, senha })
            const { token } = login.data
            loginOk(token)          
            setIsErrorValid(false)      
            setIsAuth(true)

        } catch(err){            
            setIsErrorValid(true)             
            const msgErrorApi = err['response']['data']['errors']                  
           //função que reduz array atraves da chave util
            const keys = ['msg']
            const filterObject = (obj, keys) => {
                return keys
                        .map(key => ({[key]: obj[key]}))
                        .reduce((anterior, atual) => {
                            return {
                                ...anterior,
                                ...atual
                            }
                        }, {})
            }
            const filterForMap = keys => obj => filterObject(obj, keys)
            const objError = msgErrorApi.map(filterForMap(keys))          
            setErrorValid(objError)
        }                   
    }
   
  return (
    <>
      <Header />
      <main className={classes.main}>        
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Login
          </Typography><br/>
          { isAuth && <Redirect to='/' />}
          { isErrorValid && errorValid.map( (err, index) => 
              <Typography color='secondary' variant='subtitle2' key={index}>
                  {err.msg}
              </Typography>) 
          }        
          { !isLogged &&
              <form method='POST' className={classes.form}>
                  <FormControl margin='normal'  fullWidth>
                      <InputLabel htmlFor='email'>Digite o Email</InputLabel>
                      <Input id='email' name='email' autoComplete='email' autoFocus value={email} onChange={({ target }) => setEmail(target.value)} />
                  </FormControl>
                  <FormControl margin='normal'  fullWidth>
                      <InputLabel htmlFor='password'>Digite a Senha</InputLabel>
                      <Input type='password' id='senha' autoComplete='current-password' name='senha' value={senha} onChange={({ target }) => setSenha(target.value)} />
                  </FormControl>         
                  <Button
                      type='submit'
                      fullWidth
                      variant='contained'
                      color='primary'
                      className={classes.submit}
                      onClick={handleSubmit}>                
                      Entrar
                  </Button>
              </form>
          }
        </Paper>
      </main>
    </>
  )
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(Login)