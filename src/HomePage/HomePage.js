import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import ImageCarousel from '../UI/ImageCarousel/ImageCarousel';
import Spinner from '../UI/Spinner';
import * as actionTypes from '../ReduxStore/actionTypes';
import TextDisplay from '../UI/TextDisplay';
import googleLogo from '../images/google-logo.png';

const HomePage = props => {

    const redirect = path => {
        props.history.replace(path);
    }

    useEffect( () => {
        if ( !props.user ) return;
        props.initFetch();
        props.fetchData(props.user.id);
    }, [props.user]);

    const generateSells = sells => (
            <div className="sells-content"> 
                { sells.map( ( sell, index ) => <ImageCarousel key={index + sell.title} 
                                                                date={sell.date} title={sell.title} 
                                                                description={sell.description} 
                                                                bulkImages={sell.imagesUrl}
                                                                photo={sell.profile_photo}
                                                                name={sell.owner}
                                                                phone_number={sell.phone_number}
                                                                email={sell.email}/>) }
            </div>
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
                    <TextDisplay text="Top 5 mais procura" headingType="h4"/>
                    { generateSells( props.otherSells ) }
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
        fetchData: (uId) => dispatch(ReducerAPI.fetchOtherSells(uId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


