import React from 'react';
import TextField from '@material-ui/core/TextField';
import './NovaVenda.css';
import CustomButton from '../UI/Button';

const NovaVenda = props => {
    
    return (
        <React.Fragment>
            <h4>Nova troca/venda</h4>
            <form className="new-sell" noValidate autoComplete="off">
                <TextField id="title" label="Titulo venda" variant="outlined" className="input"/>
                <TextField id="description" label="Descrição" variant="outlined" className="input" multiline rows={7}/>
                <input id="images" type="file" accept="image/*" multiple/>
                <CustomButton color="primary" className="new-sell-button" text="Criar"/>
            </form>
        </React.Fragment>
    );
}

export default NovaVenda;