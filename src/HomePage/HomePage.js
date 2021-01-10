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
import AddIcon from '@material-ui/icons/Add';
import AlgoliaSearch from '../UI/AlgoliaSearch/AlgoliaSearch';

const HomePage = props => {
    
    const cachedCredential = sessionStorage.getItem('cp-persuasive-user');

    const [ autoLoginStarted, setAutoLoginStarted ] = useState( false );

    const redirect = path => {
        props.history.replace(path);
    }

    const fetchDataOnClick = () => {   
        props.initFetch();
        props.fetchData(props.user.id);
        props.getLikeList(props.user.id);
    }

    const loginButtonClick = () => props.login();

    const generateSells = sells => (
            <React.Fragment>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  > 4 ) return null;
                        return <Card key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
                     }) }
                </div>
                <hr className="horizontal-break" />
                <TextDisplay text="Mais publicações" headingType="h4" className=""/>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  <= 4 ) return null;
                        return <Card key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
                     }) }
                </div>
                <div className="sells-content">
                    <AddIcon onClick={ fetchDataOnClick } fontSize="large" className="load-more-icon"/>
                </div>
            </React.Fragment>
            );
    
    useEffect( () => {
        if ( cachedCredential && !props.user ) loginButtonClick();
        else if ( !cachedCredential && !props.user && sessionStorage.getItem('login-init') === 'true' ) {
            props.login( true );
            setAutoLoginStarted( true );
        }
        else if ( autoLoginStarted && props.user ) setAutoLoginStarted( false );
    } )

    useEffect( () => {
        if ( !props.user ) return;
        props.initFetch();
        props.fetchData(props.user.id, true);
        props.getLikeList(props.user.id);

    }, [ props.user ] );

    return (
        <React.Fragment>
            <div className="homepage-content">
                { !props.fetchDone || ( cachedCredential  && !props.user ) || autoLoginStarted ? <Spinner /> : null}
                
                    { !props.user  ? 
                    <div className="homepage-buttons">
                        <div className="login-display">
                            { !cachedCredential && !autoLoginStarted ? 
                                <Button color="primary" text="Login" className="buttons login"  click={loginButtonClick} />
                                : null }
                            <img src={poweredByGoogle} width="25px" alt="poweredByGoogle"/>
                        </div>
                    </div> 
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
                    <TextDisplay text="Publicações mais curtidas" headingType="h4"/>
                    { props.fetchDone ? generateSells( props.otherSells ) : null }
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
        searching: state.searching
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: value => dispatch(ReducerAPI.tryLogin(value)),
        initFetch: () => dispatch({type: actionTypes.START_FETCH}),
        fetchData: (uId, limit = false) => dispatch(ReducerAPI.fetchOtherSells(uId, limit)),
        getLikeList: (uId) => dispatch(ReducerAPI.getUserLikeList(uId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


