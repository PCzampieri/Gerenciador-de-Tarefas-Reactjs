import React from 'react'
import { Typography } from '@material-ui/core'

import Header from '../Header'

function Sobre() {
    return (
        <div>
            <Header />
            <Typography component='h1' variant='h5' align='center'>
                <br /><br /><br />
                Sobre:<br /><hr />
                Desenvolvido por: Cézar Zampieri<br />
                Testando Reacjs, material-ui
            </Typography>
        </div>
    )
}
export default Sobre