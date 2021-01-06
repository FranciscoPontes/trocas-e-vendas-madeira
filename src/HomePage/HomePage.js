import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import Card from '../UI/Card/Card';
import Spinner from '../UI/Spinner';
import * as actionTypes from '../ReduxStore/actionTypes';
import TextDisplay from '../UI/TextDisplay';
import googleLogo from '../images/google-logo.png';
import AddIcon from '@material-ui/icons/Add';
import AlgoliaSearch from '../UI/AlgoliaSearch/AlgoliaSearch';

const HomePage = props => {

    const redirect = path => {
        props.history.replace(path);
    }

    useEffect( () => {
        if ( !props.user ) return;
        props.initFetch();
        props.fetchData(props.user.id, true);
        props.getLikeList(props.user.id);
    }, [props.user] );

    const fetchDataOnClick = () => {
        props.initFetch();
        props.fetchData(props.user.id);
        props.getLikeList(props.user.id);
    }

    const generateSells = sells => (
            <React.Fragment>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  > 4 ) return;
                        return <Card key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
                     }) }
                </div>
                <hr className="horizontal-break" />
                <TextDisplay text="Mais publicações" headingType="h4" className=""/>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  <= 4 ) return;
                        return <Card key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
                     }) }
                </div>
                <div className="sells-content">
                    <AddIcon onClick={ fetchDataOnClick } fontSize="large" className="load-more-icon"/>
                </div>
            </React.Fragment>
            );

    return (
        <React.Fragment>
            <div className="homepage-content">
                { !props.fetchDone ? <Spinner /> : null}
                
                    { !props.user ? 
                    <div className="homepage-buttons">
                        <div className="login-display">
                            <Button color="primary" text="Login" className="buttons" click={props.login} /> 
                            <img src={googleLogo} width="25px" />
                        </div>
                    </div> 
                    : <React.Fragment>
                        <div className="homepage-buttons">
                            <Button text="Vender/Trocar" className="buttons blue" click={ () => redirect("/nova-venda")}/>
                            <Button text="Minhas trocas/vendas" className="buttons yellow" click={ () => redirect("/minhas-vendas")}/>   
                        </div>
                        <AlgoliaSearch />
                     </React.Fragment>
                    }
                
                { props.otherSells && props.user && !props.searching ? 
                <React.Fragment>
                    <TextDisplay text="Mais procurados" headingType="h4"/>
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
        login: () => dispatch(ReducerAPI.tryLogin()),
        initFetch: () => dispatch({type: actionTypes.START_FETCH}),
        fetchData: (uId, limit = false) => dispatch(ReducerAPI.fetchOtherSells(uId, limit)),
        getLikeList: (uId) => dispatch(ReducerAPI.getUserLikeList(uId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


