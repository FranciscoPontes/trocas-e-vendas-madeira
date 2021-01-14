import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import Card from '../UI/Card/Card';
import Spinner from '../UI/Spinner';
import * as actionTypes from '../ReduxStore/actionTypes';
import TextDisplay from '../UI/TextDisplay';
import poweredByGoogle from '../images/powered_by_google_on_white.png';
import AlgoliaSearch from '../UI/AlgoliaSearch/AlgoliaSearch';
import { getRecommendedSells } from '../CustomPersonalization';
import OtherSells from '../UI/DisplayOtherSells/DisplayOtherSells';

const orderList = ( orderedList, initialList ) => {
    console.log( orderedList );
    console.log( initialList );

    let newList = [];

    if ( orderedList ) {
        for ( let i in orderedList ) {
            newList[i] = initialList[ initialList.findIndex( value => value.docId === orderedList[i]) ]
        }
    }

    console.log( "Updated list ");
    console.log( newList );

    return newList;
}


const HomePage = props => {
    
    const [ cachedCredential, setCachedCredential ] = useState( sessionStorage.getItem('cp-persuasive-user') );

    const [ autoLoginStarted, setAutoLoginStarted ] = useState( false );

    const [ fetchWithPersonalization, setFetchWithPersonalization ] = useState( false ); 

    const [ recommendedSells, setRecommendedSells ] = useState( null );

    const [ negatedFilter, setNegatedFilter ] = useState( null );

    const redirect = path => {
        props.history.replace(path);
    }

    const fetchDataOnClick = () => {   
        props.initFetch();
        props.fetchData(props.user.id);
        props.getLikeList(props.user.id);
    }

    const loginButtonClick = () => props.login();
    
    const generateSells = () => (
        <div className="sells-content"> 
            { recommendedSells.map( sell => <Card key={ sell.docId } docData={ sell } value={ sell.docId }/> ) }
        </div>
    )

    const informativeText = () => {
        return (
            <React.Fragment>
                Nesta plataforma pode colocar anúncios de vendas dos seus produtos,
                bem como ver anúncios de outras pessoas. O processo de venda ocorre externamente pela responsabilidades dos utilizadores.
                <br/> <b>Dica de uso:</b> A qualquer momento pode clicar na bandeira do canto superior esquerdo para voltar à página inicial.
            </React.Fragment>
        );
    }

    useEffect( () => { 
        if ( props.user && props.user !== 'ERROR' && props.likeList && !fetchWithPersonalization ) { 
            getRecommendedSells( props.likeList, props.user.id ).then( response => { 
                setRecommendedSells( orderList( response.orderedList, response.sells ) );
                setNegatedFilter( response.negatedFilter ); 
            } );
            setFetchWithPersonalization( true );
            }
    }, );

    useEffect( () => {
        if ( cachedCredential && !props.user ) loginButtonClick();
        else if ( !cachedCredential && !props.user && sessionStorage.getItem('login-init') === 'true' ) {
            props.login( true );
            setAutoLoginStarted( true );
        }
        else if ( props.user === 'ERROR' ) { 
            console.log( "Error trying auto login" );
            setCachedCredential( false );
            sessionStorage.removeItem('cp-persuasive-user');
            props.clearUser();
        }
        else if ( autoLoginStarted && props.user ) setAutoLoginStarted( false );
    } )

    useEffect( () => {
        if ( !props.user || props.user === 'ERROR' ) return;
        props.initFetch();
        props.fetchData(props.user.id, true);
        props.getLikeList(props.user.id);

    }, [ props.user ] );

    return (
        <React.Fragment>
            <div className="homepage-content">
                { !props.fetchDone || ( cachedCredential  && !props.user && props.user !== 'ERROR' ) || autoLoginStarted ? <Spinner /> : null}
                
                    { !props.user  ? 
                    <React.Fragment> 
                        <div className="homepage-buttons">
                            <div className="login-display">
                                { !cachedCredential && !autoLoginStarted ? 
                                    <Button color="primary" text="Login" className="buttons login"  click={loginButtonClick} />
                                    : null }
                                <img src={poweredByGoogle} width="25px" alt="poweredByGoogle"/>
                            </div>
                        </div> 
                        <TextDisplay text={informativeText()} headingType="h6"/>
                    </React.Fragment>
                    : <React.Fragment>
                        <div className="homepage-buttons">
                            <Button text="Vender" className="buttons blue" click={ () => redirect("/nova-venda")}/>
                            <Button text="Minha área" className="buttons yellow" click={ () => redirect("/minhas-vendas")}/>   
                        </div>
                        <AlgoliaSearch />
                     </React.Fragment>
                    }
                
                { props.otherSells && props.user && !props.searching ? 
                    <React.Fragment>
                    <TextDisplay text="Recomendados" headingType="h5"/>
                    { recommendedSells ? 
                        <React.Fragment>
                            { generateSells() }
                            <OtherSells filter={ negatedFilter } />
                        </React.Fragment>
                        : null }
                        { console.log( recommendedSells ) }
                    </React.Fragment> 
                : null }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        otherSells: state.otherSells,
        fetchDone: state.fetchDone,
        searching: state.searching,
        likeList: state.userLikes
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: value => dispatch(ReducerAPI.tryLogin(value)),
        initFetch: () => dispatch({type: actionTypes.START_FETCH}),
        fetchData: (uId, limit = false) => dispatch(ReducerAPI.fetchOtherSells(uId, limit)),
        getLikeList: (uId) => dispatch(ReducerAPI.getUserLikeList(uId)),
        clearUser: () => dispatch( { type: actionTypes.LOGIN_USER, data: null} )
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


