import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import './NovaVenda.css';
import CustomButton from '../UI/Button';
import {postData} from '../Firebase/Firebase';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from 'react-redux';
import * as actionTypes from '../ReduxStore/actionTypes';
import ImagePreview from '../UI/BulkImagePreview/BulkImagePreview';

const NovaVenda = props => {
    
    const [input, setInput] = useState({
                            title: "",
                            description: "",
                            price: "",
                            images: null
                            });
    
    const [images, setImages] = useState(null);                        

    const [currentImage, setCurrentImage] = useState(null);          

    const postNewSell = () => {
        var data = input;
        if (data.price <= 0) {
            alert("Preço não é válido!");
            setInput({
                ...input,
                price: 0
            })
            return;
        }
        postData(props.userId, data).then( () => {
            props.activateRefreshFlag();
            props.history.replace("/");
        });
    }

    const handleImagesChange = value => {
        let newImageState = [];
        let images = [];
        for (let image in value) {
            if ( image === 'length' ) break;
            newImageState.push(URL.createObjectURL( value[image]  ) );
            images.push( value[image] );
        }
        setImages(newImageState); 
        setInput({
            ...input,
            images: Array.from(value)
        })
    }

    return (
        <React.Fragment>
            <h4>Nova troca/venda</h4>
            <form className="new-sell" noValidate autoComplete="off">
                <TextField id="title" label="Titulo da venda" variant="outlined" className="input" onChange={(event) => setInput({...input,title: event.target.value})}/>
                <TextField id="preco" label="Preço" variant="outlined" className="input" type="number" value={input.price} onChange={(event) => setInput({...input,price: event.target.value})}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                />
                <TextField id="description" label="Descrição" variant="outlined" className="input" multiline rows={7} onChange={(event) => setInput({...input,description: event.target.value})}/>
                <input id="images" type="file" accept="image/*" multiple onChange={(event) => handleImagesChange(event.target.files)}/>
                { images ? <ImagePreview bulkImages={images} /> : null }
                <CustomButton color="primary" className="new-sell-button" text="Criar" click={postNewSell}/>
            </form>
        </React.Fragment>
    );
}        

const mapStateToProps = state =>{
    return {
        userId: state.user.id
    }
}

const mapDispatchToProps = dispatch => {
    return {
        activateRefreshFlag: () => dispatch({type:actionTypes.POST_DATA_DONE})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NovaVenda);