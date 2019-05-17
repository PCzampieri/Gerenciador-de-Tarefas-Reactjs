import React from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import { isAuthenticated } from './services/auth'
import Login from './components/Login'
import Main from './components/Main'
import CadastroPage from './components/CadastroPage'
import CadastroTarefa from './components/CadastroTarefa'
import EditTarefa from './components/EditTarefa'
import Sobre from './components/Sobre'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route 
        { ...rest } 
        render={props => 
            isAuthenticated() ? (
                <Component { ...props } />
            ) : (
                <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )
        }
    /> 
)

const Routes = () => (
    <BrowserRouter>   
        <Switch>            
            <PrivateRoute exact path='/' component={Main}  />
            <Route path='/login' component={Login} />
            <Route path='/sobre' component={Sobre} />
            <Route path='/cadastro' component={CadastroPage} />
            <PrivateRoute path='/cadastrotarefa' component={CadastroTarefa} />
            <PrivateRoute path='/editartarefa/:id' component={EditTarefa} />
            <PrivateRoute path='/app' component={() => <h1>Você está logado</h1>} />
            <Route path='*' component={() => <h2>Página não encontrada!! 404 - Error</h2>} />
        </Switch>       
    </BrowserRouter>
)
export default Routes 