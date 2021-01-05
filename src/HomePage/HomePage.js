import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import ImageCarousel from '../UI/Card/Card';
import Spinner from '../UI/Spinner';
import * as actionTypes from '../ReduxStore/actionTypes';
import TextDisplay from '../UI/TextDisplay';
import googleLogo from '../images/google-logo.png';
import AddIcon from '@material-ui/icons/Add';

const HomePage = props => {

    const redirect = path => {
        props.history.replace(path);
    }

    const docIds = props.otherSells ? Object.keys(props.otherSells).map( sell => sell ) : null;

    useEffect( () => {
        if ( !props.user ) return;
        props.initFetch();
        props.fetchData(props.user.id, docIds );
        props.getLikeList(props.user.id);
    }, [props.user] );

    const fetchDataOnClick = () => {
        props.initFetch();
        props.fetchData(props.user.id, docIds );
        props.getLikeList(props.user.id);
    }

    const generateSells = sells => (
            <React.Fragment>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  > 4 ) return;
                        return <ImageCarousel key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
                     }) }
                </div>
                <hr className="horizontal-break" />
                <TextDisplay text="Mais publicações" headingType="h4" className=""/>
                <div className="sells-content"> 
                    { Object.keys(sells).map( ( sell, index )  => {
                        if ( index  <= 4 ) return;
                        return <ImageCarousel key={sells[sell].docId} docData={sells[sell]} value={sells[sell].docId}/>;
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
                <div className="homepage-buttons">
                    { !props.user ? 
                        <div className="login-display">
                            <Button color="primary" text="Login" className="buttons" click={props.login} /> 
                            <img src={googleLogo} width="25px" />
                        </div>
                    : <React.Fragment>
                        <Button color="primary" text="Vender/Trocar" className="buttons" click={ () => redirect("/nova-venda")}/>
                        <Button color="secondary" text="Minhas trocas/vendas" className="buttons" click={ () => redirect("/minhas-vendas")}/>
                    </React.Fragment>
                    }
                </div>
                { props.otherSells && props.user ? 
                <React.Fragment>
                    <TextDisplay text="Top 5 maior procura" headingType="h4"/>
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
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(ReducerAPI.tryLogin()),
        initFetch: () => dispatch({type: actionTypes.START_FETCH}),
        fetchData: (uId, docIds) => dispatch(ReducerAPI.fetchOtherSells(uId, docIds)),
        getLikeList: (uId) => dispatch(ReducerAPI.getUserLikeList(uId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


