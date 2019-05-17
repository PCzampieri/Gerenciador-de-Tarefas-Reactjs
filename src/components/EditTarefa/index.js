import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Button from '@material-ui/core/Button'
import Avatar from '@material-ui/core/Avatar'
import { Paper, Typography, Grid } from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import NotesIcon from '@material-ui/icons/Notes'

import axios from '../../services/api'
import { getUser } from '../../services/auth'
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
    marginTop: theme.spacing.unit * 4,
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

function EditTarefa(props) {
  const { classes } = props   
  
  const[titulo, setTitulo] = useState('')
  const[descricao, setDescricao] = useState('')
 
  const[errorValid, setErrorValid] = useState([])
  const[isErrorValid, setIsErrorValid] = useState(false)  
  const[success, setSuccess] = useState(false)

  const user = getUser()
  const id = props.match.params.id

  useEffect(()=> {            
      async function fecthData() {         
        const tarefaApi = await axios.get(`/tarefas/${id}`) 
        const tarefaList = tarefaApi.data
        setTitulo(tarefaList.titulo)
        setDescricao(tarefaList.descricao)         
      }
      fecthData()
   }, [])

  const handleSubmit = async(e) => {
    e.preventDefault()    
    try {
        const userId = user.id
        await axios.put(`/tarefas/${id}`, { titulo, descricao, userId })
        setIsErrorValid(false)
        setSuccess(true)       
        setTitulo('')
        setDescricao('')

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
  return (      
    <>   
    <Header />
    <div className={classes.root}>        
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <NotesIcon />
            </Avatar>
            <Typography component='h1' variant='h5'>
                Editar Tarefa
            </Typography><br/>
            { isErrorValid && errorValid.map( (err, index) => 
                <Typography color='secondary'  variant='subtitle2' key={index}>
                    {err.msg}
                </Typography>) 
            }
            {
                success && <Redirect to='/' />
            }            
            <form method='POST' className={classes.paper} onSubmit={handleSubmit}>
                <Grid container spacing={24}>               
                    <Grid item xs={12} md={6}>
                        <FormControl margin='normal'  fullWidth>
                            <InputLabel htmlFor='titulo'>Título</InputLabel>
                            <Input id='titulo' name='titulo' type='text' defaultValue={titulo} value={titulo} onChange={({ target }) => setTitulo(target.value)} autoComplete='titulo' autoFocus />
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl margin='normal'  fullWidth>
                            <InputLabel htmlFor='descricao'>Descrição</InputLabel>
                            <Input id='descricao' name='descricao' type='text' defaultValue={descricao} value={descricao} onChange={({ target }) => setDescricao(target.value)} autoComplete='descricao' />
                        </FormControl>
                    </Grid> 
                    <Grid item xs={12} md={3}  > 
                        <FormControl margin='normal' className={classes.buttonSalve} fullWidth>
                            <Button                            
                                type='submit'
                                fullWidth
                                variant='contained'
                                color='primary'                          
                            >   Salvar Tarefa
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

EditTarefa.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(EditTarefa)