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
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../UI/ConfirmDialog/ConfirmDialog';

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

    const [ alertDialogSettings, setAlertDialogSettings ] = useState( {
        title: null,
        description: null,
        show: false,
        disableBackdrop: false
    });

    const [ alertOkClicked, setAlertOkClicked ] = useState( false );

    const postNewSell = () => {
        var data = input;
        if (data.price <= 0 || data.images === null) {
            if (data.title === "") { 
                setAlertDialogSettings( {
                    title: "Adicione um título!",
                    description: null,
                    show: true
                })
                return; 
            }
            if (data.price <= 0) { 
                setAlertDialogSettings( {
                    title: "Preço não é válido!",
                    description: "O preço tem de ser superior a 0.",
                    show: true
                })
                return; 
            }
            if (data.images === null) { 
                setAlertDialogSettings( {
                    title: "Adicione pelo menos uma imagem!",
                    description: null,
                    show: true
                })
                return; 
            }
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
            setAlertDialogSettings( {
                title: "Só pode adicionar no máximo 5 imagens!",
                description: null,
                show: true
            })
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

    useEffect( () => {
        if (createButtonClicked && props.uploadDone) {
            setAlertDialogSettings( {
                title: "Troca criada!",
                description: null,
                show: true,
                disableBackdrop: true
            })
        }
    }, [createButtonClicked, props.uploadDone]);

    useEffect( () => {
        if ( createButtonClicked && alertOkClicked) props.history.push("/");
        else if ( alertOkClicked ) {
            setAlertDialogSettings( {
                title: null,
                description: null,
                show: false
            })
            setAlertOkClicked( false );
        }
    }, [createButtonClicked, alertOkClicked ] )

    return (
        <React.Fragment>
            <div className="heading">
                <TextDisplay text="Nova venda" headingType="h4"/>
            </div>
            <form className="new-sell" noValidate autoComplete="off">
                <TextField id="title" label="Titulo da venda" variant="outlined" className="input" onChange={(event) => setInput({...input,title: event.target.value})}/>
                <TextField id="preco" label="Preço" variant="outlined" className="input" type="number" value={input.price} onChange={(event) => setInput({...input,price: event.target.value})}
                    InputProps={{
                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                    }}
                />
                <TextField id="description" label="Descrição (opcional)" variant="outlined" className="input" multiline rows={7} onChange={(event) => setInput({...input,description: event.target.value})}/>
                <TextField id="phone_number" label="Contacto (opcional)" variant="outlined" className="input" onChange={(event) => setInput({...input,phone_number: event.target.value})}/>
                <TextField id="email" label="Email" variant="outlined" className="input" onChange={(event) => setInput({...input,email: event.target.value})} value={input.email} />
                
                <input accept="image/*" id="contained-button-file" type="file" multiple onChange={(event) => handleImagesChange(event.target.files, event.target.value)} />
                <label htmlFor="contained-button-file" className="upload-container">
                    <Button variant="contained" color="primary" component="span" className="upload-button">
                        <IconButton color="primary" aria-label="upload picture" component="span" className="upload-photo-icon">
                            <PhotoCamera />
                        </IconButton>
                        Upload
                    </Button>
                </label>
                { images ? <ImagePreview bulkImages={images} /> : null }
                { !props.uploadDone ? <Spinner className="spinner-my-sells"/> : <CustomButton color="primary" className="new-sell-button" text="Criar" click={postNewSell}/> }
            </form>
            <ConfirmDialog alert disableEscapeKeyDown={alertDialogSettings.disableBackdrop} disableBackdropClick={alertDialogSettings.disableBackdrop} 
                        title={alertDialogSettings.title} description={alertDialogSettings.description} 
                        open={alertDialogSettings.show} click={ () => setAlertOkClicked( true ) } 
                        onClose={ () => setAlertDialogSettings( {...alertDialogSettings, show: false} ) } />
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
