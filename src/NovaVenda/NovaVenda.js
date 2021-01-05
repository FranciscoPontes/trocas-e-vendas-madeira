import React, {useState, useEffect} from 'react';
import TextField from '@material-ui/core/TextField';
import './NovaVenda.css';
import CustomButton from '../UI/Button';
import * as reducerAPI from '..//ReduxStore/reducer';
import InputAdornment from '@material-ui/core/InputAdornment';
import {connect} from 'react-redux';
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
                            complete: "false",
                            likeCount: 0,
                            userId: props.userId
                            });
    
    // images for preview
    const [images, setImages] = useState(null);                        

    const [createButtonClicked, setCreateButtonClicked] = useState( false );

    useEffect( () => {
        if (createButtonClicked && props.uploadDone) {
            alert("Troca/venda criada!");
            props.history.push("/");
        }
    }, [createButtonClicked, props.uploadDone]);

    const postNewSell = () => {
        var data = input;
        if (data.price <= 0 || data.images === null) {
            if (data.price <= 0) { alert("Preço não é válido!"); return; }
            if (data.images === null) { alert("Adicione pelo menos uma imagem!"); return; }
            setInput({
                ...input,
                price: 0
            })
            return;
        }
        props.uploadNewSell( data) ;
        setCreateButtonClicked( true );
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
            images: images
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
                { !props.uploadDone ? <Spinner className="new-sell-button"/> : <CustomButton color="primary" className="new-sell-button" text="Criar" click={postNewSell}/> }
            </form>
        </React.Fragment>
    );
}        

const mapStateToProps = state =>{
    return {
        userId: state.user.id,
        email: state.user.email,
        photo: state.user.photo,
        userName: state.user.name,
        uploadDone: state.uploadDone
    }
}

const mapDispatchToProps = dispatch => {
    return {
        uploadNewSell: data => dispatch( reducerAPI.uploadNewSell( data ) )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NovaVenda);