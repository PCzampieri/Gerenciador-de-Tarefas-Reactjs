import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import AccountCircleOutlinedIcon  from '@material-ui/icons/AccountCircle'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Paper, Typography, Grid, IconButton } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import axios from '../../services/api'

import Header from '../Header'

const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: theme.spacing.unit*3,  
    height: '100%',  
  },
  paper: {
    margin: 'auto',
    width: '90%',
    marginTop: theme.spacing.unit * 3,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  }, 
  textField: {     
    marginTop: 0,
    paddingLeft: 0,
    paddingRight: 0,   
  }, 
  buttonSalve: {
    display: 'flex',
    flexWrap: 'wrap', 
  },
  avatar: {
    alignItems: 'center',
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },    
})

function CadastroPage(props) {
  const { classes } = props

  const[nome, setNome] = useState('')
  const[senha, setSenha] = useState('')
  const[email, setEmail] = useState('')
  const[nascimento, setNascimento] = useState('')
  const[cpf, setCpf] = useState('')

  const[errorValid, setErrorValid] = useState([])
  const[isErrorValid, setIsErrorValid] = useState(false)
  const[showSenha, setShowSenha] = useState(false)
  const[success, setSuccess] = useState(false)

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
        await axios.post('/usuarios', { nome, cpf, nascimento, email, senha })
        setIsErrorValid(false)
        setSuccess(true)
        setNome('')
        setSenha('')
        setEmail('')
        setNascimento('')      
        setCpf('')

    } catch(err){                
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
        setIsErrorValid(true)         
    }                   
}

    const handleClickShowSenha = (e) => { 
        e.preventDefault()      
        setShowSenha(!showSenha)
    } 

  return (
    <>
    <Header />
    <div className={classes.root}>        
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <AccountCircleOutlinedIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
                Cadastro de Usuário
            </Typography><br/>
            { isErrorValid && errorValid.map( (err, index) => 
                <Typography color='secondary'  variant='subtitle2' key={index}>
                    {err.msg}
                </Typography>) 
            }
            {
                success && 
                    <Typography color='primary'  variant='h5'>
                        Cadastro efeturado com Sucesso!
                    </Typography>
            }
            <form method='POST' onSubmit={handleSubmit}>
                <Grid container spacing={24}>               
                    <Grid item xs={12} md={6}>
                        <FormControl margin='normal'  fullWidth>
                            <InputLabel htmlFor='Nome'>Digite o Nome</InputLabel>
                            <Input id='nome' name='nome' type='text' value={nome} onChange={({ target }) => setNome(target.value)} autoComplete='nome' autoFocus />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl margin='normal'  fullWidth>
                            <InputLabel htmlFor='cpf'>Digite o CPF</InputLabel>
                            <Input id='cpf' name='cpf' type='text' value={cpf} onChange={({ target }) => setCpf(target.value)} autoComplete='cpf' />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl margin='normal'  fullWidth>
                            <InputLabel htmlFor='nascimento'>Digite o Nascimento</InputLabel>
                            <Input id='nascimento' name='nascimento' type='text' value={nascimento} onChange={({ target }) => setNascimento(target.value)} autoComplete='nascimento' />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} >
                        <FormControl margin='normal' fullWidth>
                            <InputLabel htmlFor='email'   >Digite o Email</InputLabel>
                            <Input id='email' name='email' type='email' value={email} onChange={({ target }) => setEmail(target.value)} autoComplete='email'  />
                        </FormControl>
                    </Grid>   
                    <Grid item xs={12} md={6}> 
                        <FormControl margin='normal' fullWidth  className={classes.textField}   >
                            <TextField
                                value={senha} 
                                onChange={({ target }) => setSenha(target.value)}                                
                                id='senha'                                
                                margin='normal'                                   
                                type={ showSenha ? 'text' : 'password'}
                                label='Senha'
                                name= 'senha'   
                                InputProps={{
                                    endAdornment: (
                                    <InputAdornment position='end' >
                                        <IconButton 
                                        aria-label='Toggle password visibility'
                                        onClick={handleClickShowSenha}
                                        >
                                        {showSenha ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment> 
                                    ),
                                }}
                            />                             
                        </FormControl>   
                    </Grid>
                    <Grid item xs={12} md={3}  > 
                        <FormControl margin='normal' className={classes.buttonSalve} fullWidth>
                            <Button                            
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'                          
                            >   Salvar Usuário
                            </Button>
                        </FormControl>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    </div>
    </>
  )
}

CadastroPage.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(CadastroPage)