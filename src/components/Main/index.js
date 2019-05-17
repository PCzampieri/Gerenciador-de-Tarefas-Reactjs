import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { IconButton } from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/DoneOutline'
import Button from '@material-ui/core/Button'
import EditIcon from '@material-ui/icons/Edit' 

import Header from '../Header'

import axios from '../../services/api'
import { isAuthenticated, getUser } from '../../services/auth'

const styles = theme => ({
  root: { 
    margin: 'auto',   
    width: '90%',
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto',
  },
  table: {    
    minWidth: 700,
  },
  spanPendente: {
    color: 'red'
  },
  spanConcluida: {    
    color: 'green'
  },
  buttonNovaTarefa: {
    marginTop: theme.spacing.unit * 4,
    marginLeft: theme.spacing.unit * 9,
  },
  buttonEdit: {
    color: 'gray'    
  }
})

function Main(props) {
  const { classes } = props 

  const[tarefas, setTarefas] = useState({})
  const[isLoading, setIsLoading] = useState(false)     

  useEffect (()=> {    
    if(isAuthenticated()) {
        setIsLoading(true)
        const userId = getUser()
        async function fecthData() {            
            const tarefasApi = await axios.get(`/tarefas/user/${userId.id}`)             
                       
            const tarefasList = tarefasApi.data   
            //função que reduz array atraves da chave util
            const keys = ['id', 'titulo', 'descricao', 'concluida']
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
            const tarefasDB = tarefasList.map(filterForMap(keys))                             
            setTarefas(tarefasDB)           
            setIsLoading(false)            
        }
    fecthData()
    }    
  },[])       

  const loadTarefas = async() => {
            setIsLoading(true)
            const userId = getUser()            
            const tarefasApi = await axios.get(`/tarefas/user/${userId.id}`)             
                       
            const tarefasList = tarefasApi.data   
            //função que reduz array atraves da chave util
            const keys = ['id', 'titulo', 'descricao', 'concluida']
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
            const tarefasDB = tarefasList.map(filterForMap(keys))                             
            setTarefas(tarefasDB)           
            setIsLoading(false)     
  }   
  
  const handleConcluir = async(tarefa) => {    
    if(!tarefa.concluida){ 
      try{
          setIsLoading(true)
          await axios.put(`/tarefas/${tarefa.id}/concluida`)          
          loadTarefas() 
          setIsLoading(false) 
                   
        } catch(err){   
          console.log(err)       
          }       
    } else {
        try{
          setIsLoading(true)
          await axios.delete(`/tarefas/${tarefa.id}/concluida`)          
          setIsLoading(false)
          loadTarefas()
        } catch(err){           
          }      
      } 
  }  

  const handleExcluir = async(tarefa) => {
    await axios.delete(`/tarefas/${tarefa.id}`)
    loadTarefas()
  }
 
  const renderTarefas = (index, tarefa) => {
    return (     
      <TableRow key={index}>       
        <TableCell align='left'>{tarefa.titulo}</TableCell> 
        <TableCell align='left'>{tarefa.descricao}</TableCell>           
        <TableCell align='left'>
          { !tarefa.concluida
              ? <span className={classes.spanPendente}>Pendente</span> 
              : <span className={classes.spanConcluida}>CONCLUÍDA</span> 
          }  
        </TableCell>  
        <TableCell>
          <IconButton onClick={() => handleConcluir(tarefa)}>            
            <DoneIcon />
          </IconButton>  
          <IconButton >
            <Link to={{ pathname: '/editartarefa/'+tarefa.id }} >
              <EditIcon className={classes.buttonEdit} />
            </Link>                    
          </IconButton>  
          <IconButton onClick={() => handleExcluir(tarefa)}>
            <DeleteIcon />
          </IconButton>          
        </TableCell>
      </TableRow>      
    )
  }
  return (
    <>
        <Header />                 
        <Button variant='contained' className={classes.buttonNovaTarefa} component={Link} to='/cadastrotarefa' color='secondary'>Nova Tarefa</Button>
        <Paper className={classes.root} >         
        <Table className={classes.table}>
            <TableHead>
              <TableRow>
                  <TableCell align='left'>Título</TableCell>
                  <TableCell align='left'>Descrição</TableCell>
                  <TableCell align='left'>Status</TableCell>              
                  <TableCell align='left'></TableCell>              
              </TableRow>
            </TableHead>     
            <TableBody>                      
            { 
              !isLoading &&
              Object
                  .keys(tarefas)
                  .map( (key, index) => renderTarefas(index, tarefas[key]))           
            }          
            </TableBody>    
        </Table>
        </Paper>
    </>
  )
}
Main.propTypes = {
  classes: PropTypes.object.isRequired,
}
export default withStyles(styles)(Main)

