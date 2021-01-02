import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import './NovaVenda.css';
import CustomButton from '../UI/Button';
import {postData} from '../Firebase/Firebase';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from 'react-redux';
import * as actionTypes from '../ReduxStore/actionTypes';
import ImagePreview from '../UI/BulkImagePreview/BulkImagePreview';
import Spinner from '../UI/Spinner';
import $ from 'jquery';
import TextDisplay from '../UI/TextDisplay';

const NovaVenda = props => {
    
    const [input, setInput] = useState({
                            title: "",
                            description: "",
                            price: "",
                            images: null,
                            phone_number: "",
                            email: props.email,
                            date: new Date().toISOString().slice(0, 10),
                            profile_photo: props.photo,
                            owner: props.userName,
                            complete: "false"
                            });
    
    // images for preview
    const [images, setImages] = useState(null);                        
    
    // button clicked
    const [newClicked, setNewClicked] = useState(false);

    const postNewSell = () => {
        var data = input;
        if (data.price <= 0 || data.images === null) {
            if (data.price <= 0) alert("Preço não é válido!");
            if (data.images === null) alert("Adicione pelo menos uma imagem!");
            setInput({
                ...input,
                price: 0
            })
            return;
        }
        setNewClicked(true);
        postData(props.userId, data).then( () => {
            props.newSellAdded();
            setNewClicked(false);
            props.history.replace("/");
        });
    }

    const handleImagesChange = ( value, targetValue ) => {
        if ( value.length > 5 ) {
            targetValue = null;
            alert("Só pode adicionar no máximo 5 imagens!");
            $("input#images").val("");
            setImages(null); 
            setInput({
                ...input,
                images: null
            });
            return;
        }
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
        });
    }

    return (
        <React.Fragment>
            <div className="heading">
                <TextDisplay text="Nova troca/venda" headingType="h4"/>
            </div>
            <form className="new-sell" noValidate autoComplete="off">
                <TextField id="title" label="Titulo da venda" variant="outlined" className="input" onChange={(event) => setInput({...input,title: event.target.value})}/>
                <TextField id="preco" label="Preço" variant="outlined" className="input" type="number" value={input.price} onChange={(event) => setInput({...input,price: event.target.value})}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                />
                <TextField id="description" label="Descrição" variant="outlined" className="input" multiline rows={7} onChange={(event) => setInput({...input,description: event.target.value})}/>
                <TextField id="phone_number" label="Contacto (opcional)" variant="outlined" className="input" onChange={(event) => setInput({...input,phone_number: event.target.value})}/>
                <TextField id="email" label="Email" variant="outlined" className="input" onChange={(event) => setInput({...input,email: event.target.value})} value={input.email} />
                <input id="images" type="file" accept="image/*" multiple onChange={(event) => handleImagesChange(event.target.files, event.target.value)} />
                { images ? <ImagePreview bulkImages={images} /> : null }
                { newClicked ? <Spinner className="new-sell-button"/> : <CustomButton color="primary" className="new-sell-button" text="Criar" click={postNewSell}/> }
            </form>
        </React.Fragment>
    );
}        

const mapStateToProps = state =>{
    return {
        userId: state.user.id,
        email: state.user.email,
        photo: state.user.photo,
        userName: state.user.name
    }
}

const mapDispatchToProps = dispatch => {
    return {
        newSellAdded: () => dispatch({type:actionTypes.NEW_SELL_ADDED})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NovaVenda);